import { ITicketPriceBody } from "@/types/body.type";
import { ITicketPriceQuery } from "@/types/param.type";
import { AppError } from "../../utils/appError";
import { buildTicketPriceQuery } from "./ticketPrice.query";
import TicketPriceModel from "./ticketPrice.schema";

export class TicketPriceService {
    private ticketPriceModel = TicketPriceModel;

    async createPrice(data: ITicketPriceBody, userId: string) {
        const duplicate = await this.ticketPriceModel.findOne({
            timeSlot: data.timeSlot,
            ageType: data.ageType,
            formatRoom: data.formatRoom,
            seatType: data.seatType,
            dayOfWeek: data.dayOfWeek,
            isDeleted: false
        });
        if (duplicate) throw new AppError("Cấu hình giá vé này đã tồn tại", 400);

        return await this.ticketPriceModel.create({ ...data, createdBy: userId });
    }

    async getPrices(query: ITicketPriceQuery) {
        const {filter} = buildTicketPriceQuery(query);

        return await this.ticketPriceModel.find(filter)
            .populate('ageType seatType formatRoom')
            .lean();
    }

    async updatePrice(id: string, data: ITicketPriceBody, userId: string) {
        const updated = await this.ticketPriceModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { ...data, updatedBy: userId },
            { new: true }
        );
        if (!updated) throw new AppError("Không tìm thấy cấu hình giá", 404);
        return updated;
    }

    async deletePrice(id: string, userId: string) {
        const deleted = await this.ticketPriceModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true, deletedAt: new Date(), deletedBy: userId },
            { new: true }
        );
        if (!deleted) throw new AppError("Không tìm thấy cấu hình giá", 404);
        return deleted;
    }
}