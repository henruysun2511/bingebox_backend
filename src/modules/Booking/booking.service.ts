import mongoose from "mongoose";
import { getIo } from "../../configs/socket.config";
import { BookingStatusEnum, TicketStatusEnum } from "../../shares/constants/enum";
import { IBookingBody } from "../../types/body.type";
import { AppError } from "../../utils/appError";
import { generateQRCode } from "../../utils/qrCode";
import { FoodService } from "../Food/food.service";
import { MembershipService } from "../Membership/membership.service";
import RoomModel from "../Room/room.schema";
import { SeatService } from "../Seat/seat.service";
import ShowtimeModel from "../Showtime/showtime.schema";
import TicketModel from "../Ticket/ticket.schema";
import { TicketPriceService } from "../TicketPrice/ticketPrice.service";
import UserModel from "../User/user.schema";
import { VoucherService } from "../Voucher/voucher.service";
import BookingModel from "./booking.schema";

export class BookingService {
    private showtimeModel = ShowtimeModel;
    private roomModel = RoomModel;
    private userModel = UserModel;
    private bookingModel = BookingModel;
    private ticketModel = TicketModel;

    async createBooking(userId: string, dto: IBookingBody) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            /* ================== 1. USER ================== */
            const user = await this.userModel.findById(userId)
                .populate("membership")
                .session(session);

            if (!user) {
                throw new AppError("Người dùng không tồn tại", 404);
            }

            /* ================== 2. SHOWTIME + ROOM ================== */
            const showtime = await this.showtimeModel.findById(dto.showtimeId).session(session);
            if (!showtime) {
                throw new AppError("Suất chiếu không tồn tại", 404);
            }

            const room = await this.roomModel
                .findById(showtime.room)
                .populate("format")
                .session(session);

            if (!room) {
                throw new AppError("Phòng chiếu không tồn tại", 404);
            }

            /* ================== 3. INIT SERVICES ================== */
            const seatService = new SeatService();
            const priceService = new TicketPriceService();
            const foodService = new FoodService();
            const voucherService = new VoucherService();
            const membershipService = new MembershipService();

            /* ================== 4. SEAT + TICKET PRICE ================== */
            const seats = await seatService.validateSeats(
                showtime._id.toString(),
                dto.seatIds,
                session
            );

            const { ticketTotal, tickets } =
                await priceService.calculateTicketPrice(
                    seats,
                    showtime,
                    room,
                    user,
                    session
                );

            /* ================== 5. FOOD ================== */
            const { foodTotal, foodsPayload } =
                await foodService.calculateFoods(dto.foods, session);

            let totalAmount = ticketTotal + foodTotal;

            /* ================== 6. VOUCHER ================== */
            const { voucher, discount: voucherDiscount } =
                await voucherService.applyVoucher(
                    dto.voucherCode,
                    totalAmount,
                    session
                );

            /* ================== 7. POINTS ================== */
            const pointsUsed = membershipService.applyPoints(user, dto.pointsUsed);
            let discountAmount = voucherDiscount + pointsUsed;

            /* ================== 8. MEMBERSHIP DISCOUNT ================== */
            if (user.membership) {
                discountAmount += totalAmount * (user.membership as any).discountRate;
            }

            const finalAmount = Math.max(totalAmount - discountAmount, 0);

            /* ================== 9. EARN POINTS (CHƯA CỘNG NGAY) ================== */
            const pointsEarned = membershipService.calculateEarnedPoints(
                user,
                finalAmount
            );

            //format food
            const formattedFoods = foodsPayload.map((f: any) => ({
                foodId: f.foodId,
                quantity: Number(f.quantity), // Chuyển sang primitive number
                priceAtBooking: Number(f.priceAtBooking) // Chuyển sang primitive number
            }));

            // Khi dùng session với .create(), tham số thứ 2 phải là options object
            const [booking] = await this.bookingModel.create([{
                userId: user._id,
                showtime: showtime._id,
                foods: formattedFoods,
                voucher: voucher?._id,
                pointsUsed: Number(pointsUsed),
                pointsEarned: Number(pointsEarned),
                totalAmount: Number(totalAmount),
                discountAmount: Number(discountAmount),
                finalAmount: Number(finalAmount),
                bookingStatus: BookingStatusEnum.PENDING,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000)
            }], { session });

            /* ================== 11. CREATE TICKETS ================== */
            const ticketsData = await Promise.all(tickets.map(async (t) => {
                const ticketId = new mongoose.Types.ObjectId();
                const domain = ""; //url fe
                const qrUrl = `${domain}/ticket?ticketId=${ticketId}`;
                const qrCodeBase64 = await generateQRCode(qrUrl);

                return {
                    ...t,
                    _id: ticketId,
                    booking: booking._id,
                    showtime: showtime._id,
                    status: TicketStatusEnum.UNPAID, // Giữ ghế, hết hạn thì release
                    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                    qrCode: qrCodeBase64
                };
            }));

            try {
                await this.ticketModel.insertMany(ticketsData, { session });
            } catch (e: any) {
                if (e.code === 11000) {
                    throw new AppError("Có ghế đã được giữ hoặc đặt", 409);
                }
                throw e;
            }

            /* ================== 12. SAVE USER (TRỪ ĐIỂM) ================== */
            await user.save({ session });

            await session.commitTransaction();

            return booking;

        } catch (e) {
            await session.abortTransaction();
            throw e;
        } finally {
            session.endSession();
        }
    }

    async fakePayBooking(bookingId: string, userId: string) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const booking = await this.bookingModel
                .findById(bookingId)
                .session(session);

            if (!booking) {
                throw new AppError("Booking không tồn tại", 404);
            }

            if (booking.bookingStatus !== BookingStatusEnum.PENDING) {
                throw new AppError("Booking không hợp lệ", 400);
            }

            if (booking.expiresAt < new Date()) {
                throw new AppError("Booking đã hết hạn", 410);
            }

            /* ===== UPDATE BOOKING ===== */
            booking.bookingStatus = BookingStatusEnum.SUCCESS;
            await booking.save({ session });

            /* ===== UPDATE TICKETS ===== */
            await this.ticketModel.updateMany(
                { booking: booking._id },
                {
                    status: TicketStatusEnum.PAID,
                    expiresAt: null
                },
                { session }
            );

            /* ===== COMMIT ===== */
            await session.commitTransaction();

            /* ===== REALTIME ===== */
            const io = getIo();
            const roomName = `showtime-${booking.showtime.toString()}`;

            io.to(roomName).emit("seat:update", {
                type: "PAID",
                bookingId: booking._id,
                seatIds: (booking as any).seatIds
            });

            return { success: true };

        } catch (e) {
            await session.abortTransaction();
            throw e;
        } finally {
            session.endSession();
        }
    }

    async fakeFailBooking(bookingId: string) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const booking = await this.bookingModel.findById(bookingId).session(session);

            if (!booking) throw new AppError("Booking không tồn tại", 404);

            booking.bookingStatus = BookingStatusEnum.FAILED;
            await booking.save({ session });

            await this.ticketModel.updateMany(
                { booking: booking._id },
                {
                    status: TicketStatusEnum.CANCELLED,
                    expiresAt: null
                },
                { session }
            );

            await session.commitTransaction();

            const io = getIo();
            const roomName = `showtime-${booking.showtime.toString()}`;

            io.to(roomName).emit("seat:update", {
                type: "RELEASE",
                bookingId: booking._id,
                seatIds: (booking as any).seatIds
            });

            return { success: true };

        } catch (e) {
            await session.abortTransaction();
            throw e;
        } finally {
            session.endSession();
        }
    }

    async getUserBookingDetail(bookingId: string, userId: string) {
        const booking = await this.bookingModel.findOne({ _id: bookingId, userId })
            .populate("showtime")
            .populate("foods.foodId")
            .populate("userId", "fullName email");

        if (!booking) throw new AppError("Không tìm thấy đơn hàng", 404);

        // Lấy thêm danh sách vé (có chứa QR) thuộc booking này
        const tickets = await this.ticketModel.find({ booking: booking._id });

        return { booking, tickets };
    }

    async getBookings(page: number = 1, limit: number = 10, status?: string) {
        const skip = (page - 1) * limit;
        const query = status ? { bookingStatus: status } : {};

        const [items, total] = await Promise.all([
            this.bookingModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("userId", "username fullName email")
                .select("userId createdAt finalAmount bookingStatus"),
            this.bookingModel.countDocuments(query)
        ]);

        return { items, total, page, totalPages: Math.ceil(total / limit) };
    }

    async getBookingDetail(bookingId: string) {
        const booking = await this.bookingModel.findById(bookingId)
            .populate("userId", "username fullName email phoneNumber")
            .populate({
                path: "showtime",
                populate: [
                    { path: "movie", select: "name" },
                    { path: "room", select: "name" }
                ]
            })
            .populate("foods.foodId", "name");

        if (!booking) throw new AppError("Không tìm thấy hóa đơn", 404);

        const tickets = await this.ticketModel.find({ booking: booking._id });

        return { booking, tickets };
    }


    async deleteCancelledData() {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            //Xóa tất cả vé có trạng thái CANCELLED
            const ticketDeleteResult = await this.ticketModel.deleteMany(
                { status: TicketStatusEnum.CANCELLED },
                { session }
            );

            //Xóa tất cả booking có trạng thái FAILED
            const bookingDeleteResult = await this.bookingModel.deleteMany(
                { bookingStatus: BookingStatusEnum.FAILED },
                { session }
            );

            await session.commitTransaction();

            return {
                deletedTickets: ticketDeleteResult.deletedCount,
                deletedBookings: bookingDeleteResult.deletedCount
            };
        } catch (e) {
            await session.abortTransaction();
            throw e;
        } finally {
            session.endSession();
        }
    }

}
