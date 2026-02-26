import { ClientSession } from "mongoose";
import { ITicketPriceBody } from "../../types/body.type";
import { IRoom, ISeat, IShowtime, IUser } from "../../types/object.type";
import { ITicketPriceQuery } from "../../types/param.type";
import { AppError } from "../../utils/appError";
import { buildPagination } from "../../utils/buildPagination";
import { calcAge } from "../../utils/calcAge";
import { mapDayOfWeek } from "../../utils/mapDayOfWeek";
import { default as AgeTypeModel } from "../ageType/ageType.schema";
import ShowtimeModel from "../showtime/showtime.schema";
import { buildTicketPriceQuery } from "./ticketPrice.query";
import TicketPriceModel from "./ticketPrice.schema";

export class TicketPriceService {
    private ticketPriceModel = TicketPriceModel;
    private ageTypeModel = AgeTypeModel;
    private showtimeModel = ShowtimeModel;

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
        const { page, limit, skip } = buildPagination(query);

        const [items, total] = await Promise.all([
            this.ticketPriceModel
                .find(filter)
                .skip(skip)
                .limit(limit)
                .populate({ path: 'ageType', select: 'name' })
                .populate({ path: 'seatType', select: 'name' })
                .populate({ path: 'formatRoom', select: 'name' })
                .populate({ path: 'timeSlot', select: 'name' })
                .lean(),

            this.ticketPriceModel.countDocuments(filter),
        ]);

        return {
            items,
            pagination: {
                page,
                limit,
                totalItems: total,
                totalPages: Math.ceil(total / limit),
            },
        };
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
            // Đảm bảo lấy ID, không lấy cả Object. 
            // Nếu seat.seatType đã được populate, nó là một object, ta lấy ._id
            const seatTypeId = seat.seatType._id || seat.seatType;
            const formatRoomId = room.format._id || room.format;
            const timeSlotId = showtime.timeslot._id || showtime.timeslot;

            const price = await this.ticketPriceModel.findOne({
                seatType: seatTypeId,
                formatRoom: formatRoomId,
                timeSlot: timeSlotId,
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

    async previewSeatPrice(
        seat: ISeat,
        showtime: IShowtime,
        room: IRoom,
        user: IUser
    ) {
        const age = calcAge(user.birth);

        const ageType = await this.ageTypeModel.findOne({
            minAge: { $lte: age },
            maxAge: { $gte: age }
        });

        if (!ageType) throw new AppError("Không xác định độ tuổi", 400);

        const dayOfWeek = mapDayOfWeek(showtime.startTime);

        const seatTypeId = (seat.seatType as any)?._id || seat.seatType;
        const formatRoomId = (room.format as any)?._id || room.format;
        const timeSlotId = (showtime.timeslot as any)?._id || showtime.timeslot;

        const price = await this.ticketPriceModel.findOne({
            seatType: seatTypeId,
            formatRoom: formatRoomId,
            timeSlot: timeSlotId,
            dayOfWeek,
            ageType: ageType._id,
            isDeleted: false
        });

        if (!price) throw new AppError("Thiếu cấu hình giá vé", 400);

        return {
            seatId: seat._id,
            ticketPriceId: price._id,
            price: price.finalPrice
        };
    }


}