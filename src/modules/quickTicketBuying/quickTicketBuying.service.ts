import mongoose from "mongoose";
import { BaseStatusEnum } from "../../shares/constants/enum";
import { AppError } from "../../utils/appError";
import ShowtimeModel from "../showtime/showtime.schema";

export class QuickTicketBuyingService {
    private showtimeModel = ShowtimeModel;

    // Bước 2: Chọn Phim -> Lấy danh sách Rạp (Tối ưu bằng Aggregation)
    async getCinemasByMovie(movieId: string) {
        if (!mongoose.Types.ObjectId.isValid(movieId)) throw new AppError("ID phim không hợp lệ", 400);

        // Sử dụng aggregate để join và group ngay tại database
        const result = await this.showtimeModel.aggregate([
            {
                $match: {
                    movie: new mongoose.Types.ObjectId(movieId),
                    isDeleted: false,
                    status: BaseStatusEnum.ACTIVE,
                    startTime: { $gte: new Date() } // Chỉ lấy các suất chiếu trong tương lai
                }
            },
            {
                $lookup: {
                    from: "rooms", // tên collection của Room
                    localField: "room",
                    foreignField: "_id",
                    as: "roomInfo"
                }
            },
            { $unwind: "$roomInfo" },
            {
                $lookup: {
                    from: "cinemas", // tên collection của Cinema
                    localField: "roomInfo.cinema",
                    foreignField: "_id",
                    as: "cinemaInfo"
                }
            },
            { $unwind: "$cinemaInfo" },
            {
                $group: {
                    _id: "$cinemaInfo._id",
                    name: { $first: "$cinemaInfo.name" }
                }
            },
            { $project: { _id: 1, name: 1 } }
        ]);

        return result;
    }

    // Bước 3: Chọn Rạp -> Lấy các Ngày có suất chiếu
    async getDatesByMovieAndCinema(movieId: string, cinemaId: string) {
        const mId = new mongoose.Types.ObjectId(movieId.trim());
        const cId = new mongoose.Types.ObjectId(cinemaId.trim());

        // Bước 1: Kiểm tra xem phim này CÓ SUẤT CHIẾU NÀO KHÔNG (không phân biệt quá khứ/tương lai)
        const hasShowtimes = await this.showtimeModel.countDocuments({
            movie: mId,
            isDeleted: false,
            status: BaseStatusEnum.ACTIVE
        });

        if (hasShowtimes === 0) {
            throw new AppError("Phim này hiện không có suất chiếu nào khả dụng trên hệ thống", 404);
        }

        const showtimes = await this.showtimeModel.aggregate([
            {
                $match: {
                    movie: mId,
                    isDeleted: false,
                    status: BaseStatusEnum.ACTIVE,
                    // ✅ Đã loại bỏ lọc startTime >= today để lấy cả quá khứ
                }
            },
            {
                $lookup: {
                    from: "rooms",
                    localField: "room",
                    foreignField: "_id",
                    as: "roomInfo"
                }
            },
            {
                $match: { "roomInfo": { $ne: [] } }
            },
            { $unwind: "$roomInfo" },
            {
                $match: {
                    "roomInfo.cinema": cId
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$startTime",
                            timezone: "+07:00"
                        }
                    }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // ✅ Cập nhật thông báo lỗi phù hợp với việc tìm kiếm lịch sử
        if (showtimes.length === 0) {
            throw new AppError("Rạp này không có dữ liệu suất chiếu cho phim bạn chọn", 404);
        }

        return showtimes.map(item => item._id);
    }

    async debugQuickBooking(movieId: string, cinemaId: string) {
        const mId = new mongoose.Types.ObjectId(movieId);

        // Bước 1: Kiểm tra xem phim này có suất chiếu nào không?
        const step1 = await this.showtimeModel.find({ movie: mId }).limit(1);
        console.log("Step 1 (Showtimes by Movie):", step1.length > 0 ? "OK" : "FAILED");

        // Bước 2: Kiểm tra lookup sang Room có ra dữ liệu không?
        const step2 = await this.showtimeModel.aggregate([
            { $match: { movie: mId } },
            { $lookup: { from: "rooms", localField: "room", foreignField: "_id", as: "roomInfo" } },
            { $limit: 1 }
        ]);
        console.log("Step 2 (Lookup Room):", step2[0]?.roomInfo?.length > 0 ? "OK" : "FAILED - Sai tên collection 'rooms' hoặc ID room không khớp");

        // Bước 3: Kiểm tra Cinema ID
        if (step2[0]?.roomInfo?.[0]) {
            console.log("Cinema ID trong DB:", step2[0].roomInfo[0].cinema.toString());
            console.log("Cinema ID bạn truyền vào:", cinemaId);
            console.log("Khớp nhau không?:", step2[0].roomInfo[0].cinema.toString() === cinemaId);
        }
    }

    // Bước 4: Chọn Ngày -> Lấy Suất chiếu cụ thể
    async getShowtimesFinal(movieId: string, cinemaId: string, date: string) {
        // Đảm bảo lấy đúng khoảng thời gian của ngày đó theo UTC/Local
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);

        // Lấy thêm thông tin formatRoom (2D/3D/IMAX) nếu cần để user dễ chọn
        const showtimes = await this.showtimeModel.aggregate([
            {
                $match: {
                    movie: new mongoose.Types.ObjectId(movieId),
                    isDeleted: false,
                    status: 'ACTIVE',
                    startTime: { $gte: startOfDay, $lte: endOfDay }
                }
            },
            {
                $lookup: {
                    from: "rooms",
                    localField: "room",
                    foreignField: "_id",
                    as: "roomData"
                }
            },
            { $unwind: "$roomData" },
            { $match: { "roomData.cinema": new mongoose.Types.ObjectId(cinemaId) } },
            {
                $project: {
                    _id: 1,
                    startTime: 1,
                    roomName: "$roomData.name",
                }
            },
            { $sort: { startTime: 1 } }
        ]);

        return showtimes;
    }
}