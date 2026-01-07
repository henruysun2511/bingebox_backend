import { AppError } from "../../utils/appError";

import { IShowtimeBody } from "@/types/body.type";
import { IShowtimeQuery } from "@/types/param.type";
import { buildPagination } from "@/utils/buildPagination";
import { default as MovieModel } from "../Movie/movie.schema";
import { default as TimeSlotModel } from "../TimeSlot/timeSlot.schema";
import { buildShowtimeQuery } from "./showtime.query";
import { default as ShowtimeModel } from "./showtime.schema";

export class ShowtimeService {
    private showtimeModel = ShowtimeModel;
    private movieModel = MovieModel;
    private timeSlotModel = TimeSlotModel;

    async createShowtime(data: IShowtimeBody, userId: string) {
        const { movie, room, startTime } = data;

        const movieDoc = await this.movieModel.findOne({ _id: movie, isDeleted: false });
        if (!movieDoc) throw new AppError("Phim không tồn tại", 404);

        //Tính endTime
        const start = new Date(startTime);
        const end = new Date(start.getTime() + (movieDoc.duration + 15) * 60000);

        const startStr = start.toTimeString().slice(0, 5);

        //Tự động tìm timeslot
        const matchedSlot = await this.timeSlotModel.findOne({
            startTime: { $lte: startStr },
            endTime: { $gt: startStr },
            isDeleted: false
        });
        if (!matchedSlot) throw new AppError("Giờ chiếu không thuộc khung giờ quy định", 400);

        //Kiểm tra trùng khung giờ suất chiếu trường cùng phòng
        const overlap = await this.showtimeModel.findOne({
            room,
            isDeleted: false,
            startTime: { $lt: end },
            endTime: { $gt: start },
        });
        if (overlap) throw new AppError("Phòng đã có suất chiếu trùng giờ", 400);

        return this.showtimeModel.create({
            movie,
            room,
            startTime: start,
            endTime: end,
            timeslot: matchedSlot._id,
            createdBy: userId,
        });
    }

    async getShowtimes(query: IShowtimeQuery) {
        const { filter, sort } = buildShowtimeQuery(query);
        const { page, limit, skip } = buildPagination(query);

        const [items, total] = await Promise.all([
            this.showtimeModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .select("_id movie room date startTime")
                .populate("movie", "name poster duration")
                .populate("room", "name")
                .lean(),
            this.showtimeModel.countDocuments(filter),
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

    async updateShowtime(id: string, data: IShowtimeBody, userId: string) {
        const showtime = await this.showtimeModel.findOne({
            _id: id,
            isDeleted: false
        });
        if (!showtime) throw new AppError("Không tìm thấy suất chiếu", 404);

        //Có vé rồi không cho sửa
        //...

        const {
            movie = showtime.movie,
            room = showtime.room,
            startTime = showtime.startTime,
        } = data;

        const movieDoc = await this.movieModel.findOne({
            _id: movie,
            isDeleted: false
        });
        if (!movieDoc) throw new AppError("Phim không tồn tại", 404);

        const start = new Date(startTime);
        const end = new Date(
            start.getTime() + (movieDoc.duration + 15) * 60000
        );

        //Gán lại TimeSlot
        const startStr =
            start.getHours().toString().padStart(2, "0") +
            ":" +
            start.getMinutes().toString().padStart(2, "0");

        const matchedSlot = await this.timeSlotModel.findOne({
            startTime: { $lte: startStr },
            endTime: { $gt: startStr },
            isDeleted: false
        });

        if (!matchedSlot)
            throw new AppError("Giờ chiếu không thuộc khung giờ quy định", 400);

        // Check trùng lịch (loại trừ chính nó)
        const overlap = await this.showtimeModel.findOne({
            _id: { $ne: id },
            room,
            isDeleted: false,
            startTime: { $lt: end },
            endTime: { $gt: start }
        });

        if (overlap)
            throw new AppError("Phòng chiếu đã có suất chiếu khác trong thời gian này", 400);

        return await this.showtimeModel.findByIdAndUpdate(
            id,
            {
                ...data,
                movie,
                room,
                startTime,
                endTime: end,
                timeslot: matchedSlot._id,
                updatedBy: userId
            },
            { new: true }
        );
    }

    async deleteShowtime(id: string, userId: string) {
        //Có vé rồi không cho xóa
        // const hasBooking = await Booking.exists({
        //     showtimeId: id,
        //     bookingStatus: { $in: ["PENDING", "SUCCESS"] }
        // });
        // if (hasBooking) throw new AppError("Không thể xoá suất chiếu đã có vé", 400);

        const result = await this.showtimeModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true, deletedBy: userId, deletedAt: new Date() },
            { new: true }
        );
        if (!result) throw new AppError("Không tìm thấy suất chiếu", 404);
        return result;
    }
}