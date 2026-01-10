import { AppError } from "../../utils/appError";
import { buildPagination } from "../../utils/buildPagination";
import { default as FormatRoomModel } from "./formatRoom.schema";

export class FormatRoomService {
    private formatRoomModel = FormatRoomModel;

    async getFormatRooms(query: any) {
        const { page, limit, skip } = buildPagination(query);
        
        const [items, total] = await Promise.all([
            this.formatRoomModel.find({ isDeleted: false }).skip(skip).limit(limit).lean(),
            this.formatRoomModel.countDocuments({ isDeleted: false }),
        ]);

        return {
            items,
            pagination: { page, limit, totalItems: total, totalPages: Math.ceil(total / limit) },
        };
    }

    async getFormatRoomDetail(id: string) {
        const format = await this.formatRoomModel.findOne({ _id: id, isDeleted: false });
        if (!format) throw new AppError("Không tìm thấy định dạng phòng", 404);
        return format;
    }

    async createFormatRoom(data: any, userId: string) {
        const existing = await this.formatRoomModel.findOne({ name: data.name, isDeleted: false });
        if (existing) throw new AppError("Tên định dạng này đã tồn tại", 400);

        return this.formatRoomModel.create({ ...data, createdBy: userId });
    }

    async updateFormatRoom(id: string, data: any, userId: string) {
        const updated = await this.formatRoomModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { ...data, updatedBy: userId },
            { new: true, runValidators: true }
        );
        if (!updated) throw new AppError("Không tìm thấy định dạng để cập nhật", 404);
        return updated;
    }

    async deleteFormatRoom(id: string, userId: string) {
        const deleted = await this.formatRoomModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true, deletedAt: new Date(), deletedBy: userId },
            { new: true }
        );
        if (!deleted) throw new AppError("Không tìm thấy định dạng để xóa", 404);
        return deleted;
    }
}