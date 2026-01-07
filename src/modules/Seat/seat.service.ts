import mongoose from "mongoose";
import { AppError } from "../../utils/appError";
import { default as RoomModel } from "../Room/room.schema";
import { default as SeatModel } from "./seat.schema";

export class SeatService {
    private seatModel = SeatModel;
    private roomModel = RoomModel;

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

    async getSeatsByRoomId(roomId: string) {
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
}

