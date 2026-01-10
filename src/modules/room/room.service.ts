import mongoose from "mongoose";
import { IRoomBody } from "../../types/body.type";
import { AppError } from "../../utils/appError";
import CinemaModel from "../cinema/cinema.schema";
import FormatRoomModel from "../formatRoom/formatRoom.schema";
import { buildRoomQuery } from "./room.query";
import RoomModel from "./room.schema";

export class RoomService {
    private roomModel = RoomModel;
    private cinemaModel = CinemaModel;
    private formatRoomModel = FormatRoomModel;

    async createRoom(data: IRoomBody, userId: string) {
        const [cinema, format] = await Promise.all([
            this.cinemaModel.findOne({ _id: data.cinema, isDeleted: false }),
            this.formatRoomModel.findOne({ _id: data.format, isDeleted: false })
        ]);

        if (!cinema) throw new AppError("Rạp phim không tồn tại", 404);
        if (!format) throw new AppError("Định dạng phòng không tồn tại", 404);

        const duplicate = await this.roomModel.findOne({
            name: data.name,
            cinema: data.cinema,
            isDeleted: false
        });
        if (duplicate) throw new AppError("Tên phòng đã tồn tại trong rạp này", 400);

        return await this.roomModel.create({ ...data, createdBy: userId });
    }

    async getRooms(query: any) {
        const { filter } = buildRoomQuery(query);
        return this.roomModel
            .find(filter)
            .populate('format', 'name')
            .lean();
    }

    async updateRoom(id: string, data: IRoomBody, userId: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("ID phòng không hợp lệ", 400);
        }

        const [cinema, format] = await Promise.all([
            this.cinemaModel.findOne({ _id: data.cinema, isDeleted: false }),
            this.formatRoomModel.findOne({ _id: data.format, isDeleted: false })
        ]);

        if (!cinema) throw new AppError("Rạp phim không tồn tại", 404);
        if (!format) throw new AppError("Định dạng phòng không tồn tại", 404);

        const duplicate = await this.roomModel.findOne({
            name: data.name,
            cinema: data.cinema,
            isDeleted: false
        });
        if (duplicate) throw new AppError("Tên phòng đã tồn tại trong rạp này", 400);

        const updatedRoom = await this.roomModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { ...data, updatedBy: userId },
            { new: true, runValidators: true }
        );

        if (!updatedRoom) throw new AppError("Không tìm thấy phòng chiếu", 404);
        return updatedRoom;
    }

    async deleteRoom(id: string, userId: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("ID phòng không hợp lệ", 400);
        }

        const deletedRoom = await this.roomModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isDeleted: true,
                deletedAt: new Date(),
                deletedBy: userId
            },
            { new: true }
        );

        if (!deletedRoom) throw new AppError("Không tìm thấy phòng chiếu hoặc đã bị xóa", 404);
        return deletedRoom;
    }
}
