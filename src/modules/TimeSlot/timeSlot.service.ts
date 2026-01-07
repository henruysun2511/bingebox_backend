import { ITimeSlotBody } from "@/types/body.type";
import { AppError } from "../../utils/appError";
import { default as TimeSlotModel } from "./timeSlot.schema";

export class TimeSlotService {
    private timeSlotModel = TimeSlotModel;

    async getTimeSlots() {
        return await this.timeSlotModel
            .find({ isDeleted: false })
            .sort({ startTime: 1 })
            .lean();
    }

    async createTimeSlot(data: ITimeSlotBody, userId: string) {
        return this.timeSlotModel.create({ ...data, createdBy: userId });
    }

    async updateTimeSlot(id: string, data: ITimeSlotBody, userId: string) {
        const updated = await this.timeSlotModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { ...data, updatedBy: userId },
            { new: true, runValidators: true }
        );
        if (!updated) throw new AppError("Không tìm thấy khung giờ", 404);
        return updated;
    }

    async deleteTimeSlot(id: string, userId: string) {
        const deleted = await this.timeSlotModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true, deletedAt: new Date(), deletedBy: userId },
            { new: true }
        );
        if (!deleted) throw new AppError("Không tìm thấy khung giờ để xóa", 404);
        return deleted;
    }
}