import mongoose, { ClientSession } from "mongoose";
import { TicketStatusEnum } from "../../shares/constants/enum";
import { AppError } from "../../utils/appError";
import { default as RoomModel } from "../room/room.schema";
import { default as ShowtimeModel } from "../showtime/showtime.schema";
import { default as TicketModel } from "../ticket/ticket.schema";
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
            const room = await this.roomModel.findById(roomId);
            if (!room) throw new AppError("Phòng không tồn tại", 404);

            await this.seatModel.deleteMany({ room: roomId }, { session });

            const seatPayload = seats.map(seat => ({
                code: seat.code,
                row: seat.row,
                column: seat.column,
                isBlocked: seat.isBlocked,
                isCoupleSeat: seat.isCoupleSeat,
                partnerSeatCode: seat.partnerSeatCode,
                seatType: seat.isBlocked
                    ? undefined
                    : new mongoose.Types.ObjectId(seat.seatTypeId),
                room: roomId,
                createdBy: userId
            }));

            const createdSeats = await this.seatModel.insertMany(seatPayload, { session });

            // LINK GHẾ ĐÔI THEO CODE
            for (const seat of createdSeats.filter(s => s.isCoupleSeat)) {
                const partner = createdSeats.find(
                    s => s.code === (seat as any).partnerSeatCode
                );

                if (partner) {
                    await this.seatModel.findByIdAndUpdate(
                        seat._id,
                        { partnerSeat: partner._id },
                        { session }
                    );
                }
            }

            // TÍNH SEAT LAYOUT
            const validSeats = createdSeats.filter(s => !s.isBlocked);

            const maxRowIndex = Math.max(
                ...validSeats.map(s => s.row.charCodeAt(0) - 65)
            );

            const maxColumn = Math.max(
                ...validSeats.map(s => s.column ?? 0)
            );

            await this.roomModel.findByIdAndUpdate(
                roomId,
                {
                    seatLayout: {
                        rows: maxRowIndex + 1,
                        columns: maxColumn
                    },
                    totalSeats: validSeats.length
                },
                { session }
            );

            await session.commitTransaction();
            return createdSeats;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }

    async getSeatsByRoom(roomId: string) {
        const seats = await this.seatModel.find({
            room: roomId
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

