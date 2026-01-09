import mongoose, { ClientSession } from "mongoose";
import { TicketStatusEnum } from "../../shares/constants/enum";
import { AppError } from "../../utils/appError";
import { default as RoomModel } from "../Room/room.schema";
import { default as ShowtimeModel } from "../Showtime/showtime.schema";
import { default as TicketModel } from "../Ticket/ticket.schema";
import { default as SeatModel } from "./seat.schema";

export class SeatService {
    private seatModel = SeatModel;
    private roomModel = RoomModel;
    private showtimeModel = ShowtimeModel;
    private ticketModel = TicketModel;


    async updateSeat(roomId: string, seats: any[], userId: string) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const room = await this.roomModel.findOne({ _id: roomId, isDeleted: false });
            if (!room) throw new AppError("Phòng không tồn tại", 404);

            //Xóa ghế cũ
            await this.seatModel.deleteMany({ roomId }, { session });

            //Chuẩn bị payload và chèn ghế mới
            const seatPayload = seats.map(seat => ({
                ...seat,
                roomId: new mongoose.Types.ObjectId(roomId),
                createdBy: userId
            }));

            // insertMany trả về mảng các document đã kèm _id
            const createdSeats = await this.seatModel.insertMany(seatPayload, { session });

            // XỬ LÝ GHẾ ĐÔI (PARTNER LINKING)
            const coupleSeats = createdSeats.filter(s => s.isCoupleSeat && (s as any).coupleId);

            if (coupleSeats.length > 0) {
                const updatePromises = [];

                for (const currentSeat of coupleSeats) {
                    // Tìm ghế còn lại có cùng coupleId nhưng khác _id
                    const partner = coupleSeats.find(s =>
                        (s as any).coupleId === (currentSeat as any).coupleId &&
                        s._id.toString() !== currentSeat._id.toString()
                    );

                    if (partner) {
                        updatePromises.push(
                            this.seatModel.findByIdAndUpdate(
                                currentSeat._id,
                                { partnerSeat: partner._id },
                                { session }
                            )
                        );
                    }
                }
                await Promise.all(updatePromises);
            }

            //Cập nhật totalSeats cho Room
            await this.roomModel.findByIdAndUpdate(
                roomId,
                { totalSeats: createdSeats.filter(s => !s.isBlocked).length },
                { session }
            );

            await session.commitTransaction();
            return createdSeats;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async getSeatsByRoom(roomId: string) {
        const seats = await this.seatModel.find({
            roomId: roomId
        })
            .sort({
                row: 1,
                column: 1,
                "position.y": 1,
                "position.x": 1
            })
            .populate("seatType", "name color")
            .lean();

        return seats;
    }

    async getSeatsByShowtime(showtimeId: string) {
        if (!mongoose.Types.ObjectId.isValid(showtimeId)) {
            throw new AppError("ID suất chiếu không hợp lệ", 400);
        }

        /* ================== 1. SHOWTIME ================== */
        const showtime = await this.showtimeModel.findOne({
            _id: showtimeId,
            isDeleted: false
        }).lean();

        if (!showtime) {
            throw new AppError("Không tìm thấy suất chiếu", 404);
        }

        /* ================== 2. ALL SEATS IN ROOM ================== */
        const allSeats = await this.seatModel.find({
            room: showtime.room,
            isDeleted: false
        })
            .sort({ row: 1, number: 1 })
            .lean();

        /* ================== 3. TICKETS (LOCK SEAT) ================== */
        const now = new Date();

        const tickets = await this.ticketModel.find({
            showtime: showtimeId,
            status: { $ne: TicketStatusEnum.CANCELLED }
        })
            .select("seat status expiresAt")
            .lean();

        /**
         * Map seatId -> status
         * SOLD  = PAID
         * HOLD  = UNPAID + chưa hết hạn
         */
        const seatStatusMap = new Map<string, "SOLD" | "HOLD">();

        for (const t of tickets) {
            const seatId = t.seat.toString();

            if (t.status === TicketStatusEnum.PAID) {
                seatStatusMap.set(seatId, "SOLD");
            } else if (
                t.status === TicketStatusEnum.UNPAID &&
                t.expiresAt &&
                t.expiresAt > now
            ) {
                seatStatusMap.set(seatId, "HOLD");
            }
        }

        /* ================== 4. MERGE ================== */
        const seatsWithStatus = allSeats.map(seat => ({
            _id: seat._id,
            row: seat.row,
            code: seat.code,
            seatType: seat.seatType,
            status: seatStatusMap.get(seat._id.toString()) ?? "AVAILABLE"
        }));

        return seatsWithStatus;
    }


    async validateSeats(showtimeId: string, seatIds: string[], session: ClientSession) {
        const seats = await SeatModel.find({ _id: { $in: seatIds } }).session(session);
        if (seats.length !== seatIds.length) {
            throw new AppError("Có ghế không tồn tại", 400);
        }

        const booked = await TicketModel.find({
            showtime: showtimeId,
            seat: { $in: seatIds },
            status: { $ne: TicketStatusEnum.CANCELLED }
        }).session(session);

        if (booked.length > 0) {
            throw new AppError("Ghế đã được đặt", 400);
        }

        return seats;
    }
}

