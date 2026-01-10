import { ClientSession } from "mongoose";
import { ITicketPriceBody } from "../../types/body.type";
import { IRoom, ISeat, IShowtime, IUser } from "../../types/object.type";
import { ITicketPriceQuery } from "../../types/param.type";
import { AppError } from "../../utils/appError";
import { calcAge } from "../../utils/calcAge";
import { mapDayOfWeek } from "../../utils/mapDayOfWeek";
import { default as AgeTypeModel } from "../ageType/ageType.schema";
import { buildTicketPriceQuery } from "./ticketPrice.query";
import TicketPriceModel from "./ticketPrice.schema";

export class TicketPriceService {
    private ticketPriceModel = TicketPriceModel;
    private ageTypeModel = AgeTypeModel;

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
        const { filter } = buildTicketPriceQuery(query);

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

    async calculateTicketPrice(
        seats: ISeat[],
        showtime: IShowtime,
        room: IRoom,
        user: IUser,
        session: ClientSession
    ) {
        const age = calcAge(user.birth);
        const ageType = await this.ageTypeModel.findOne({
            minAge: { $lte: age },
            maxAge: { $gte: age }
        }).session(session);

        if (!ageType) throw new AppError("Không xác định độ tuổi", 400);

        const dayOfWeek = mapDayOfWeek(showtime.startTime);

        let total = 0;
        const tickets = [];

        for (const seat of seats) {
            const price = await TicketPriceModel.findOne({
                seatType: seat.seatType,
                formatRoom: room.format,
                timeSlot: showtime.timeslot,
                dayOfWeek,
                ageType: ageType._id
            }).session(session);

            if (!price) throw new AppError("Thiếu cấu hình giá vé", 400);

            total += price.finalPrice;
            tickets.push({
                seat: seat._id,
                ticketPrice: price._id,
                price: price.finalPrice
            });
        }

        return { ticketTotal: total, tickets };
    }
}