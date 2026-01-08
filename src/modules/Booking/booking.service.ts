import { calcAge } from "@/utils/calcAge";
import { mapDayOfWeek } from "@/utils/mapDayOfWeek";
import mongoose from "mongoose";
import { BaseStatusEnum, BookingStatusEnum } from "../../shares/constants/enum";
import { AppError } from "../../utils/appError";
import AgeTypeModel from "../AgeType/ageType.schema";
import FoodModel from "../Food/food.schema";
import RoomModel from "../Room/room.schema";
import SeatModel from "../Seat/seat.schema";
import ShowtimeModel from "../Showtime/showtime.schema";
import TicketModel from "../Ticket/ticket.schema";
import TicketPriceModel from "../TicketPrice/ticketPrice.schema";
import UserModel from "../User/user.schema";
import VoucherModel from "../Voucher/voucher.schema";
import BookingModel from "./booking.schema";

export class BookingService {
    private bookingModel = BookingModel;
    private userModel = UserModel;
    private showtimeModel = ShowtimeModel;
    private ticketModel = TicketModel;
    private roomModel = RoomModel;
    private seatModel = SeatModel;
    private ticketPriceModel = TicketPriceModel;
    private foodModel = FoodModel;
    private ageTypeModel = AgeTypeModel;
    private voucherModel = VoucherModel;

    async createBooking(userId: string, dto: any) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // 1. Lấy user + membership
            const user = await this.userModel.findById(userId)
                .populate("membership")
                .session(session);

            if (!user) throw new AppError("Không tìm thấy người dùng", 404);

            // 2. Kiểm tra showtime
            const showtime = await this.showtimeModel.findById(dto.showtimeId).session(session);
            if (!showtime) throw new AppError("Không tìm thấy suất chiếu", 404);

            // 3. Kiểm tra ghế đã đặt chưa
            const bookedSeats = await this.ticketModel.find({
                showtime: showtime._id,
                seat: { $in: dto.seatIds },
                status: { $ne: "CANCELLED" }
            }).session(session);

            if (bookedSeats.length > 0) {
                throw new AppError("Một hoặc nhiều ghế đã được đặt", 400);
            }

            // Lấy thông tin phòng và định dạng
            const room = await this.roomModel.findById(showtime.room)
                .populate("format")
                .session(session);

            if (!room) throw new AppError("Không tìm thấy phòng chiếu", 404);

            // 4. TÍNH TIỀN VÉ
            let ticketTotal = 0;
            const ticketsToCreate: any[] = [];
            const showtimeDate = new Date(showtime.startTime);

            //Tính tuổi 
            const age = calcAge(user.birth);
            const ageType = await this.ageTypeModel.findOne({
                minAge: { $lte: age },
                maxAge: { $gte: age }
            }).session(session);
            if (!ageType) {
                throw new AppError("Không xác định được loại tuổi", 400);
            }

            const dayOfWeek = mapDayOfWeek(new Date(showtime.startTime));

            const seats = await this.seatModel.find({
                _id: { $in: dto.seatIds }
            }).session(session);

            if (seats.length !== dto.seatIds.length) {
                throw new AppError("Một hoặc nhiều ghế không tồn tại", 404);
            }
            for (const seatId of seats) {
                const seat = await this.seatModel.findById(seatId).session(session);
                if (!seat) throw new AppError(`Không tìm thấy ghế ID: ${seatId}`, 404);

                const ticketPrice = await this.ticketPriceModel.findOne({
                    seatType: seat.seatType,
                    formatRoom: room.format,
                    timeSlot: showtime.timeslot,
                    dayOfWeek: dayOfWeek,
                    ageType: ageType._id
                }).session(session);

                if (!ticketPrice) throw new AppError("Không tìm thấy cấu hình giá vé phù hợp", 400);

                ticketTotal += ticketPrice.finalPrice;

                ticketsToCreate.push({
                    showtime: showtime._id,
                    seat: seat._id,
                    ticketPrice: ticketPrice._id,
                    price: ticketPrice.finalPrice,
                    status: "UNUSED"
                });
            }

            // 5. TÍNH TIỀN ĐỒ ĂN
            let foodTotal = 0;
            const foodsBooking: any[] = [];

            if (dto.foods && dto.foods.length > 0) {
                for (const f of dto.foods) {
                    const food = await this.foodModel.findOne({ _id: f.foodId, isDeleted: false }).session(session);
                    if (!food) throw new AppError("Món ăn không tồn tại", 404);

                    const itemTotal = Number(food.price) * f.quantity;
                    foodTotal += itemTotal;

                    foodsBooking.push({
                        foodId: food._id,
                        quantity: f.quantity,
                        priceAtBooking: food.price
                    });
                }
            }

            // 6. TỔNG TIỀN BAN ĐẦU
            const totalAmount = ticketTotal + foodTotal;
            let discountAmount = 0;

            // 7. ÁP VOUCHER
            let voucherDoc = null;
            if (dto.voucherCode) {
                voucherDoc = await this.voucherModel.findOne({
                    code: dto.voucherCode,
                    status: BaseStatusEnum.ACTIVE,
                    startTime: { $lte: new Date() },
                    endTime: { $gte: new Date() }
                }).session(session);

                if (!voucherDoc) throw new AppError("Mã giảm giá không hợp lệ hoặc đã hết hạn", 400);
                if (totalAmount < voucherDoc.minOrderValue) throw new AppError("Đơn hàng không đủ giá trị tối thiểu để áp dụng voucher", 400);
                if (voucherDoc.usedCount >= voucherDoc.maxUsage) throw new AppError("Voucher đã hết lượt sử dụng", 400);

                discountAmount += Math.min(voucherDoc.maxDiscountAmount, totalAmount);
                voucherDoc.usedCount += 1;
                await voucherDoc.save({ session });
            }

            // 8. ÁP ĐIỂM THÀNH VIÊN (Nếu khách chọn dùng điểm)
            let pointsUsed = 0;
            if (dto.pointsUsed && dto.pointsUsed > 0) {
                if (dto.pointsUsed > user.currentPoints) throw new AppError("Số dư điểm tích lũy không đủ", 400);

                pointsUsed = dto.pointsUsed;
                discountAmount += pointsUsed; // Quy đổi 1 điểm = 1đ 
                user.currentPoints -= pointsUsed;
            }

            // 9. ÁP GIẢM GIÁ HẠNG THÀNH VIÊN (Nếu có)
            if (user.membership) {
                const membershipDiscount = totalAmount * (user.membership as any).discountRate;
                discountAmount += membershipDiscount;
            }

            // 10. TÍNH TIỀN CUỐI
            const finalAmount = Math.max(totalAmount - discountAmount, 0);

            // 11. TÍCH ĐIỂM SAU THANH TOÁN
            let pointsEarned = 0;
            if (user.membership) {
                pointsEarned = Math.floor(finalAmount * (user.membership as any).pointAccumulationRate);
                user.currentPoints += pointsEarned;
            }

            user.totalSpending += finalAmount;
            await user.save({ session });

            // 12. TẠO BOOKING
            const booking = await this.bookingModel.create(
                [
                    {
                        userId: user._id,
                        showtime: showtime._id,
                        foods: foodsBooking,
                        voucher: voucherDoc?._id,
                        pointsUsed,
                        pointsEarned,
                        totalAmount,
                        discountAmount,
                        finalAmount,
                        bookingStatus: BookingStatusEnum.PENDING,
                        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 phút giữ chỗ
                    }
                ],
                { session }
            );

            // 13. TẠO TICKETS
            for (const t of ticketsToCreate) {
                t.booking = booking[0]._id;
                t.qrCode = `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            }

            await this.ticketModel.insertMany(ticketsToCreate, { session });

            await session.commitTransaction();

            return {
                booking: booking[0],
                ticketTotal,
                foodTotal,
                discountAmount,
                finalAmount,
                pointsEarned
            };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}
