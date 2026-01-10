import mongoose from "mongoose";
import { ISeatTypeBody } from "../../types/body.type";
import { AppError } from "../../utils/appError";
import SeatTypeModel from "./seatType.schema";

export class SeatTypeService {
    private seatTypeModel = SeatTypeModel;

    async getAllSeatTypes() {
        return await this.seatTypeModel.find({ isDeleted: false }).lean();
    }

    async getSeatTypeDetail(id: string) {
        const seatType = await this.seatTypeModel.findOne({ _id: id, isDeleted: false });
        if (!seatType) throw new AppError("Không tìm thấy loại ghế", 404);
        return seatType;
    }

    async createSeatType(data: ISeatTypeBody, userId: string) {
        const duplicate = await this.seatTypeModel.findOne({ name: data.name, isDeleted: false });
        if (duplicate) throw new AppError("Tên loại ghế đã tồn tại", 400);

        return await this.seatTypeModel.create({ ...data, createdBy: userId });
    }

    async updateSeatType(id: string, data: ISeatTypeBody, userId: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError("ID không hợp lệ", 400);

        const updated = await this.seatTypeModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { ...data, updatedBy: userId },
            { new: true, runValidators: true }
        );

        if (!updated) throw new AppError("Không tìm thấy loại ghế", 404);
        return updated;
    }

    async deleteSeatType(id: string, userId: string) {
        const deleted = await this.seatTypeModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true, deletedAt: new Date(), deletedBy: userId },
            { new: true }
        );
        if (!deleted) throw new AppError("Không tìm thấy loại ghế", 404);
        return deleted;
    }
}