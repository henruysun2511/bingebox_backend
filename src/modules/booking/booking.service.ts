import mongoose from "mongoose";
import { BookingStatusEnum, TicketStatusEnum } from "../../shares/constants/enum";
import { IBookingBody } from "./booking.validation";
import { IMembership } from "../membership/membership.interface";
import { AppError } from "../../utils/appError";
import { generateQRCode } from "../../utils/qrCode";
import { FoodService } from "../food/food.service";
import { MembershipService } from "../membership/membership.service";
import RoomModel from "../room/room.schema";
import { SeatService } from "../seat/seat.service";
import ShowtimeModel from "../showtime/showtime.schema";
import TicketModel from "../ticket/ticket.schema";
import { TicketPriceService } from "../ticketPrice/ticketPrice.service";
import UserModel from "../user/user.schema";
import { VoucherService } from "../voucher/voucher.service";
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
                await foodService.calculateFoods(
                    dto.foods.map(f => ({ ...f, foodId: new mongoose.Types.ObjectId(f.foodId) })),
                    session
                );

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
                discountAmount += totalAmount * (user.membership as IMembership).discountRate;
            }

            const finalAmount = Math.max(totalAmount - discountAmount, 0);

            /* ================== 9. EARN POINTS (CHƯA CỘNG NGAY) ================== */
            const pointsEarned = membershipService.calculateEarnedPoints(
                user,
                finalAmount
            );

            //format food
            const formattedFoods = foodsPayload.map((f: { foodId: mongoose.Types.ObjectId; quantity: number; priceAtBooking: Number }) => ({
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
                const domain = "https://bingebox-flax.vercel.app"; //url fe
                const qrUrl = `${domain}/ticket/${ticketId}`;
                const qrCodeBase64 = await generateQRCode(qrUrl);

                
                return {
                    ...t,
                    _id: ticketId,
                    booking: booking._id,
                    showtime: showtime._id,
                    user: user._id,
                    status: TicketStatusEnum.UNPAID, // Giữ ghế, hết hạn thì release
                    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                    qrCode: qrCodeBase64
                };
            }));

            try {
                await this.ticketModel.insertMany(ticketsData, { session });
            } catch (e: unknown) {
                if ((e as any)?.code === 11000) {
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

        return {
            items, 
            pagination: {
                page,
                limit,
                totalItems: total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getBookingDetail(bookingId: string) {
        // 1. Lấy thông tin Booking
        const booking = await this.bookingModel.findById(bookingId)
            .populate("userId", "username fullName email phoneNumber")
            .populate({
                path: "showtime",
                populate: [
                    { path: "movie", select: "name agePermission duration" },
                    {
                        path: "room",
                        select: "name format",
                        populate: {
                            path: "format",
                            select: "name"
                        }
                    }
                ]
            })
            .populate("foods.foodId", "name")
            .lean();

        if (!booking) throw new AppError("Không tìm thấy hóa đơn", 404);

        // 2. Lấy thông tin Tickets và POPULATE Seat + SeatType
        const tickets = await this.ticketModel.find({ booking: booking._id })
            .populate({
                path: "seat",
                select: "code seatType",
                populate: {
                    path: "seatType",
                    select: "name color price"
                }
            })
            .lean();

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
