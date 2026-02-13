import { AppError } from "../../utils/appError";

import mongoose from "mongoose";
import { BaseStatusEnum } from "../../shares/constants/enum";
import { IShowtimeBody } from "../../types/body.type";
import { IShowtimeQuery } from "../../types/param.type";
import { buildPagination } from "../../utils/buildPagination";
import { default as MovieModel } from "../movie/movie.schema";
import { default as RoomModel } from "../room/room.schema";
import { default as TimeSlotModel } from "../timeSlot/timeSlot.schema";
import { buildShowtimeQuery } from "./showtime.query";
import { default as ShowtimeModel } from "./showtime.schema";

export class ShowtimeService {
    private showtimeModel = ShowtimeModel;
    private movieModel = MovieModel;
    private timeSlotModel = TimeSlotModel;
    private roomModel = RoomModel;

    async createShowtime(data: IShowtimeBody, userId: string) {
        const { movie, room, startTime, subtitle } = data;

        const movieDoc = await this.movieModel.findOne({ _id: movie, isDeleted: false });
        if (!movieDoc) throw new AppError("Phim không tồn tại", 404);

        // UTC time
        const start = new Date(startTime);
        const end = new Date(start.getTime() + (movieDoc.duration + 15) * 60000);

        // Convert sang giờ VN để match timeslot
        const startStr = start.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Asia/Ho_Chi_Minh",
        });

        const matchedSlot = await this.timeSlotModel.findOne({
            isDeleted: false,
            $or: [
                {
                    $expr: { $lt: ["$startTime", "$endTime"] },
                    startTime: { $lte: startStr },
                    endTime: { $gt: startStr }
                },
                {
                    $expr: { $gt: ["$startTime", "$endTime"] },
                    $or: [
                        { startTime: { $lte: startStr } },
                        { endTime: { $gt: startStr } }
                    ]
                }
            ]
        });

        if (!matchedSlot) throw new AppError("Giờ chiếu không thuộc khung giờ quy định", 400);

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
            subtitle,
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
                .select("_id subtitle movie room startTime endTime timeslot")
                .populate("movie", "name poster duration")
                .populate("timeslot", "name")
                .populate({
                    path: "room",
                    select: "name cinema",
                    populate: {
                        path: "cinema",
                        select: "name",
                    },
                })
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
        // 1. Kiểm tra suất chiếu tồn tại
        const showtime = await this.showtimeModel.findOne({
            _id: id,
            isDeleted: false
        });
        if (!showtime) throw new AppError("Không tìm thấy suất chiếu", 404);

        // 2. Kiểm tra vé (Nên bổ sung check Ticket tại đây)
        // const hasTickets = await this.ticketModel.exists({ showtime: id });
        // if (hasTickets) throw new AppError("Suất chiếu đã có vé, không thể chỉnh sửa", 400);

        const {
            movie = showtime.movie,
            room = showtime.room,
            startTime = showtime.startTime,
        } = data;

        // 3. Kiểm tra phim và tính toán thời gian kết thúc
        const movieDoc = await this.movieModel.findOne({ _id: movie, isDeleted: false });
        if (!movieDoc) throw new AppError("Phim không tồn tại", 404);

        const start = new Date(startTime);
        const end = new Date(start.getTime() + (movieDoc.duration + 15) * 60000);

        // 4. Convert sang giờ VN để match timeslot (Đồng bộ với logic Create)
        const startStr = start.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Asia/Ho_Chi_Minh",
        });

        // 5. Tìm TimeSlot với logic hỗ trợ khung giờ xuyên đêm
        const matchedSlot = await this.timeSlotModel.findOne({
            isDeleted: false,
            $or: [
                {
                    $expr: { $lt: ["$startTime", "$endTime"] },
                    startTime: { $lte: startStr },
                    endTime: { $gt: startStr }
                },
                {
                    $expr: { $gt: ["$startTime", "$endTime"] },
                    $or: [
                        { startTime: { $lte: startStr } },
                        { endTime: { $gt: startStr } }
                    ]
                }
            ]
        });

        if (!matchedSlot) throw new AppError("Giờ chiếu không thuộc khung giờ quy định", 400);

        // 6. Check trùng lịch (Loại trừ chính nó bằng $ne: id)
        const overlap = await this.showtimeModel.findOne({
            _id: { $ne: id },
            room,
            isDeleted: false,
            startTime: { $lt: end },
            endTime: { $gt: start },
        });

        if (overlap) throw new AppError("Phòng chiếu đã có suất chiếu khác trong thời gian này", 400);

        // 7. Cập nhật
        return await this.showtimeModel.findByIdAndUpdate(
            id,
            {
                ...data,
                movie,
                room,
                startTime: start,
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

    async getShowtimesByCinema(cinemaId: string, date?: string) {
        return await this.showtimeModel.aggregate([
            { $match: { isDeleted: false, status: BaseStatusEnum.ACTIVE } },

            // $lookup giúp join Showtime với Room thông qua _id
            // Sau bước này, mỗi showtime sẽ có dạng:
            //             {
            //   _id: "...",
            //   movie: "...",
            //   room: [
            //     {
            //       _id: "...",
            //       name: "Phòng 1",
            //       cinema: "cinemaId"
            //     }
            //   ]
            // }
            {
                $lookup: {
                    from: "rooms",
                    localField: "room",
                    foreignField: "_id",
                    as: "room"
                }
            },


            //$unwind ROOM – BÓC ARRAY
            //Do chỉ có 1 suất chỉ có 1 phòng nên chuyển chuyển array phòng thành object
            { $unwind: "$room" },

            //$match giúp lọc suất chiếu theo rạp
            {
                $match: {
                    "room.cinema": new mongoose.Types.ObjectId(cinemaId)
                }
            },

            // lọc suất chiếu theo ngày
            ...(date ? [{
                $match: {
                    startTime: {
                        $gte: new Date(`${date}T00:00:00.000Z`),
                        $lte: new Date(`${date}T23:59:59.999Z`)
                    }
                }
            }] : []),

            //Sắp xếp suất chiếu theo startTime
            { $sort: { startTime: 1 } },

            //$group giúp gom nhóm theo movie
            //Data giờ sẽ trông như này
            //             {
            //   _id: "movieId",
            //   showtimes: [
            //     { startTime: "...", room: { name: "Phòng 1" } },
            //     { startTime: "...", room: { name: "Phòng 2" } }
            //   ]
            // }
            {
                $group: {
                    _id: "$movie",
                    showtimes: {
                        $push: {
                            _id: "$_id",
                            startTime: "$startTime",
                            room: {
                                id: "$room._id",
                                name: "$room.name"
                            }
                        }
                    }
                }
            },

            //$lookup giúp lấy thông tin phim
            {
                $lookup: {
                    from: "movies",
                    localField: "_id",
                    foreignField: "_id",
                    as: "movie"
                }
            },
            { $unwind: "$movie" },

            //$project định dạng response trả về
            {
                $project: {
                    _id: 0,
                    movie: {
                        id: "$movie._id",
                        title: "$movie.title",
                        poster: "$movie.poster",
                        duration: "$movie.duration",
                        agePermission: "$movie.agePermission",
                        format: "$movie.format"
                    },
                    showtimes: 1
                }
            }
        ]);
    }

    async getShowtimesByMovie(movieId: string, date: string) {
        const startOfDay = new Date(`${date}T00:00:00+07:00`);
        const endOfDay = new Date(`${date}T23:59:59+07:00`);

        return await this.showtimeModel.aggregate([
            {
                $match: {
                    movie: new mongoose.Types.ObjectId(movieId),
                    startTime: { $gte: startOfDay, $lte: endOfDay },
                    status: BaseStatusEnum.ACTIVE,
                    isDeleted: false
                }
            },
            { $sort: { startTime: 1 } },
            // Lookup lấy thông tin Phòng và Rạp
            {
                $lookup: {
                    from: "rooms",
                    localField: "room",
                    foreignField: "_id",
                    as: "room"
                }
            },
            { $unwind: "$room" },
            {
                $lookup: {
                    from: "cinemas",
                    localField: "room.cinema",
                    foreignField: "_id",
                    as: "cinema"
                }
            },
            { $unwind: "$cinema" },
            // Lookup lấy thông tin định dạng phòng (2D/3D/IMAX)
            {
                $lookup: {
                    from: "formatrooms",
                    localField: "room.format",
                    foreignField: "_id",
                    as: "format"
                }
            },
            { $unwind: "$format" },
            // Nhóm theo Rạp và Định dạng
            {
                $group: {
                    _id: {
                        cinemaId: "$cinema._id",
                        formatId: "$format._id"
                    },
                    cinemaName: { $first: "$cinema.name" },
                    cinemaAddress: { $first: "$cinema.location" },
                    formatName: { $first: "$format.name" },
                    showtimes: {
                        $push: {
                            _id: "$_id",
                            startTime: "$startTime",
                            endTime: "$endTime",
                            subtitle: "$subtitle"
                        }
                    }
                }
            },
            // Nhóm lại lần nữa để gom các Format vào trong Rạp
            {
                $group: {
                    _id: "$_id.cinemaId",
                    name: { $first: "$cinemaName" },
                    address: { $first: "$cinemaAddress" },
                    formats: {
                        $push: {
                            format: "$formatName",
                            showtimes: "$showtimes"
                        }
                    }
                }
            },
            { $sort: { name: 1 } }
        ]);
    }

    async getShowtimesGroupByRoom(cinemaId: string, date?: string) {
        const startOfDay = date ? new Date(`${date}T00:00:00+07:00`) : null;
        const endOfDay = date ? new Date(`${date}T23:59:59+07:00`) : null;

        return await this.roomModel.aggregate([
            // 1. Lấy tất cả các phòng thuộc rạp này trước
            {
                $match: {
                    cinema: new mongoose.Types.ObjectId(cinemaId),
                    isDeleted: false
                }
            },
            // 2. Lookup để lấy suất chiếu thuộc từng phòng
            {
                $lookup: {
                    from: "showtimes",
                    let: { roomId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$room", "$$roomId"] },
                                        { $eq: ["$isDeleted", false] },
                                        // Chỉ lọc theo ngày nếu có biến date truyền vào
                                        ...(startOfDay ? [
                                            { $gte: ["$startTime", startOfDay] },
                                            { $lte: ["$startTime", endOfDay] }
                                        ] : [])
                                    ]
                                }
                            }
                        },
                        { $sort: { startTime: 1 } },
                        // 3. Lookup ngược lại để lấy thông tin phim cho từng suất chiếu
                        {
                            $lookup: {
                                from: "movies",
                                localField: "movie",
                                foreignField: "_id",
                                as: "movieDetails"
                            }
                        },
                        { $unwind: "$movieDetails" },
                        // Định dạng lại object showtime con
                        {
                            $project: {
                                _id: 1,
                                startTime: 1,
                                endTime: 1,
                                subtitle: 1,
                                status: 1,
                                movie: {
                                    _id: "$movieDetails._id",
                                    name: "$movieDetails.name",
                                    poster: "$movieDetails.poster",
                                    duration: "$movieDetails.duration"
                                }
                            }
                        }
                    ],
                    as: "showtimes"
                }
            },
            // 4. Định dạng output cuối cùng
            {
                $project: {
                    _id: 1,
                    roomName: "$name",
                    showtimes: 1 // Sẽ là mảng rỗng [] nếu không có suất chiếu
                }
            },
            { $sort: { roomName: 1 } }
        ]);
    }
}