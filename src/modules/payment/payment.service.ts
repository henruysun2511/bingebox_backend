import crypto from "crypto";
import mongoose from "mongoose";
import { ENV } from "../../shares/constants/environment";
import { BookingStatusEnum, PaymentMethodEnum, PaymentStatusEnum, TicketStatusEnum } from "../../shares/constants/enum";
import { AppError } from "../../utils/appError";
import { getIo } from "../../configs/socket.config";
import { sendTicketEmail, TicketEmailData } from "../../utils/sendEmail";
import BookingModel from "../booking/booking.schema";
import TicketModel from "../ticket/ticket.schema";
import UserModel from "../user/user.schema";
import ShowtimeModel from "../showtime/showtime.schema";
import PaymentModel from "./payment.schema";

const PAYMENT_PREFIX = "BINGEBOX_";

interface PopulatedShowtime {
    _id: mongoose.Types.ObjectId;
    movie: { _id: mongoose.Types.ObjectId; name: string };
    room: { _id: mongoose.Types.ObjectId; name: string; cinema: { _id: mongoose.Types.ObjectId; name: string } };
    startTime: Date;
}

interface PopulatedTicket {
    _id: mongoose.Types.ObjectId;
    seat: { _id: mongoose.Types.ObjectId; code: string };
    price: number;
    qrCode: string;
}

interface PopulatedFood {
    foodId: { _id: mongoose.Types.ObjectId; name: string };
    quantity: number;
    priceAtBooking: number;
}

export class PaymentService {

    async createPayment(bookingId: string, userId: string) {
        const booking = await BookingModel.findOne({ _id: bookingId, userId });
        if (!booking) throw new AppError("Booking không tồn tại hoặc không thuộc về bạn", 403);
        if (booking.bookingStatus !== BookingStatusEnum.PENDING) throw new AppError("Booking không hợp lệ", 400);
        if (booking.expiresAt < new Date()) throw new AppError("Booking đã hết hạn", 410);

        const existed = await PaymentModel.findOne({
            booking: booking._id,
            status: PaymentStatusEnum.PENDING
        });
        if (existed) return existed;

        const referenceCode = `${PAYMENT_PREFIX}${booking._id.toString()}`;

        const [payment] = await PaymentModel.create([{
            booking: booking._id,
            referenceCode,
            amount: booking.finalAmount,
            method: PaymentMethodEnum.SEPAY,
            status: PaymentStatusEnum.PENDING
        }]);

        return payment;
    }

    async handleSePayWebhook(rawBody: string, signature?: string) {
        // Xác thực chữ ký HMAC-SHA256 trước khi làm bất cứ điều gì khác.
        // Không có bước này, bất kỳ ai biết URL webhook cũng có thể tự POST
        // một payload giả để "xác nhận thanh toán" và nhận vé miễn phí.
        if (!signature) {
            throw new AppError("Thiếu chữ ký xác thực", 401);
        }

        const expectedSignature = crypto
            .createHmac("sha256", ENV.SEPAY_WEBHOOK_SECRET)
            .update(rawBody)
            .digest("hex");

        const signatureBuffer = Buffer.from(signature);
        const expectedBuffer = Buffer.from(expectedSignature);
        const isValidSignature =
            signatureBuffer.length === expectedBuffer.length &&
            crypto.timingSafeEqual(signatureBuffer, expectedBuffer);

        if (!isValidSignature) {
            throw new AppError("Chữ ký không hợp lệ", 401);
        }

        let payload: any;
        try {
            payload = JSON.parse(rawBody);
        } catch {
            throw new AppError("Dữ liệu webhook không hợp lệ", 400);
        }

        // Payload thật của SePay dùng "id" và "transferAmount", KHÔNG PHẢI
        // "transactionId" và "amount" như trước đây — bug này khiến mọi
        // webhook đều bị reject vì thiếu dữ liệu.
        const { id: bankTransactionId, transferAmount: amount, content, transferType } = payload;

        if (!bankTransactionId || !amount || !content) {
            throw new AppError("Thiếu thông tin giao dịch", 400);
        }

        // Chỉ xử lý giao dịch tiền vào. Webhook trên dashboard đã lọc sẵn
        // "Có tiền vào" nhưng vẫn nên kiểm tra lại ở code cho chắc chắn.
        if (transferType !== "in") {
            return { success: true, ignored: true };
        }

        const existed = await PaymentModel.findOne({ bankTransactionId });
        if (existed) return { success: true, duplicated: true };

        const normalizedContent = String(content).trim();
        if (!normalizedContent.startsWith(PAYMENT_PREFIX)) {
            throw new AppError("Nội dung chuyển khoản không hợp lệ", 400);
        }

        // Một số ngân hàng có thể nối thêm text phía sau nội dung chuyển khoản
        // (vd: "BINGEBOX_65f... chuyen tien"), nên chỉ lấy đúng 24 ký tự hex
        // của ObjectId ngay sau prefix thay vì trim cả chuỗi còn lại.
        const match = normalizedContent
            .slice(PAYMENT_PREFIX.length)
            .match(/^[a-fA-F0-9]{24}/);
        const bookingId = match?.[0];

        if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
            throw new AppError("Mã đơn hàng không hợp lệ", 400);
        }

        const payment = await PaymentModel.findOne({ booking: bookingId, status: PaymentStatusEnum.PENDING });
        if (!payment) throw new AppError("Không tìm thấy giao dịch đang chờ", 404);

        if (payment.amount !== amount) {
            throw new AppError("Số tiền không khớp", 400);
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            payment.bankTransactionId = bankTransactionId;
            payment.status = PaymentStatusEnum.SUCCESS;
            await payment.save({ session });

            const booking = await BookingModel.findById(bookingId).session(session);
            if (!booking) throw new AppError("Booking không tồn tại", 404);

            const tickets = await TicketModel.find({ booking: booking._id }).session(session);
            const seatIds = tickets.map(t => t.seat.toString());

            booking.bookingStatus = BookingStatusEnum.SUCCESS;
            await booking.save({ session });

            await TicketModel.updateMany(
                { booking: booking._id },
                { status: TicketStatusEnum.PAID, expiresAt: null },
                { session }
            );

            await UserModel.findByIdAndUpdate(
                booking.userId,
                {
                    $inc: {
                        currentPoints: booking.pointsEarned,
                        totalSpending: booking.finalAmount
                    }
                },
                { session }
            );

            await session.commitTransaction();

            const io = getIo();
            const roomName = `showtime-${booking.showtime.toString()}`;
            io.to(roomName).emit("seat:update", {
                type: "PAID",
                bookingId: booking._id,
                seatIds
            });

            this.sendConfirmationEmail(booking, tickets.map(t => ({
                _id: t._id,
                seat: { _id: t.seat, code: "" },
                price: t.price,
                qrCode: t.qrCode
            })));

            return { success: true };
        } catch (e) {
            await session.abortTransaction();
            throw e;
        } finally {
            session.endSession();
        }
    }

    private async sendConfirmationEmail(booking: any, tickets: PopulatedTicket[]) {
        try {
            const [user, showtime, populatedBooking] = await Promise.all([
                UserModel.findById(booking.userId).select("email fullName username"),
                ShowtimeModel.findById(booking.showtime)
                    .populate<{ movie: { _id: mongoose.Types.ObjectId; name: string } }>("movie", "name")
                    .populate<{ room: { _id: mongoose.Types.ObjectId; name: string; cinema: { _id: mongoose.Types.ObjectId; name: string } } }>({
                        path: "room",
                        select: "name cinema",
                        populate: { path: "cinema", select: "name" }
                    }),
                BookingModel.findById(booking._id).populate<{ foods: PopulatedFood[] }>("foods.foodId", "name"),
            ]);

            if (!user || !showtime) return;

            const room = showtime.room;
            const foodNames: Record<string, string> = {};
            for (const f of (populatedBooking?.foods || [])) {
                if (f.foodId?._id) foodNames[f.foodId._id.toString()] = f.foodId.name;
            }

            const emailData: TicketEmailData = {
                email: user.email,
                customerName: user.fullName || user.username,
                cinemaName: room?.cinema?.name || "",
                roomName: room?.name || "",
                movieName: showtime.movie?.name || "",
                startTime: showtime.startTime,
                seats: tickets.map(t => ({
                    code: t.seat?.code || "",
                    price: t.price,
                    qrCode: t.qrCode,
                })),
                foods: booking.foods.map((f: any) => ({
                    name: foodNames[f.foodId?.toString()] || "",
                    quantity: f.quantity,
                    price: f.priceAtBooking,
                })),
                totalAmount: booking.finalAmount,
            };

            await sendTicketEmail(emailData);
        } catch (err) {
            console.error("Gửi email xác nhận thất bại:", err);
        }
    }

    async getPaymentStatus(bookingId: string, userId: string) {
        const [payment, booking] = await Promise.all([
            PaymentModel.findOne({ booking: bookingId }).lean(),
            BookingModel.findOne({ _id: bookingId, userId }).lean(),
        ]);

        return {
            paymentStatus: payment?.status || null,
            bookingStatus: booking?.bookingStatus || null,
            referenceCode: payment?.referenceCode || null,
            amount: payment?.amount || null,
        };
    }

    async handleFailedPayment(bookingId: string, userId: string) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Ràng buộc userId ngay trong query: nếu không có, một user đã đăng
            // nhập vẫn có thể hủy booking của người khác chỉ bằng cách đoán bookingId.
            const booking = await BookingModel.findOne({ _id: bookingId, userId }).session(session);
            if (!booking) throw new AppError("Booking không tồn tại hoặc không thuộc về bạn", 404);
            if (booking.bookingStatus !== BookingStatusEnum.PENDING) throw new AppError("Booking không ở trạng thái chờ thanh toán", 400);

            const tickets = await TicketModel.find({ booking: booking._id }).session(session);
            const seatIds = tickets.map(t => t.seat.toString());

            booking.bookingStatus = BookingStatusEnum.FAILED;
            await booking.save({ session });

            await TicketModel.updateMany(
                { booking: booking._id },
                { status: TicketStatusEnum.CANCELLED, expiresAt: null },
                { session }
            );

            await PaymentModel.updateOne(
                { booking: booking._id, status: PaymentStatusEnum.PENDING },
                { status: PaymentStatusEnum.FAILED },
                { session }
            );

            if ((booking.pointsUsed || 0) > 0) {
                await UserModel.findByIdAndUpdate(
                    booking.userId,
                    { $inc: { currentPoints: booking.pointsUsed } },
                    { session }
                );
            }

            await session.commitTransaction();

            const io = getIo();
            const roomName = `showtime-${booking.showtime.toString()}`;
            io.to(roomName).emit("seat:update", {
                type: "RELEASE",
                bookingId: booking._id,
                seatIds
            });

            return { success: true };
        } catch (e) {
            await session.abortTransaction();
            throw e;
        } finally {
            session.endSession();
        }
    }
}