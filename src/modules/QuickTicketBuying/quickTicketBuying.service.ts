import { BaseStatusEnum } from "@/shares/constants/enum";
import mongoose from "mongoose";
import { AppError } from "../../utils/appError";
import ShowtimeModel from "../Showtime/showtime.schema";

export class QuickTicketBuyingService {
    private showtimeModel = ShowtimeModel;

    // Bước 1: Lấy danh sách phim đang có suất chiếu (Đã có trong MovieService)

    // Bước 2: Chọn Phim -> Lấy danh sách Rạp có chiếu phim đó
    async getCinemasByMovie(movieId: string) {
        if (!mongoose.Types.ObjectId.isValid(movieId)) throw new AppError("ID phim không hợp lệ", 400);

        const showtimes = await this.showtimeModel
            .find({ movie: movieId, isDeleted: false, status: BaseStatusEnum.ACTIVE })
            .populate({
                path: 'room',
                populate: { path: 'cinema', select: 'name' }
            })
            .lean();

        // Lọc trùng Rạp (vì một rạp có nhiều suất chiếu)
        const cinemasMap = new Map();
        showtimes.forEach((st: any) => {
            const cinema = st.room?.cinema;
            if (cinema && !cinemasMap.has(cinema._id.toString())) {
                cinemasMap.set(cinema._id.toString(), cinema);
            }
        });

        return Array.from(cinemasMap.values());
    }

    // Bước 3: Chọn Rạp -> Lấy các Ngày có suất chiếu của Phim đó tại Rạp đó
    async getDatesByMovieAndCinema(movieId: string, cinemaId: string) {
        const showtimes = await this.showtimeModel
            .find({ movie: movieId, isDeleted: false, status: 'ACTIVE' })
            .populate({
                path: 'room',
                match: { cinema: cinemaId }
            })
            .lean();

        // Chỉ lấy những suất chiếu thuộc rạp đã chọn
        const validShowtimes = showtimes.filter((st: any) => st.room !== null);

        // Lấy danh sách ngày duy nhất (YYYY-MM-DD)
        const dates = [...new Set(validShowtimes.map((st: any) => 
            new Date(st.startTime).toISOString().split('T')[0]
        ))];

        return dates.sort();
    }

    // Bước 4: Chọn Ngày -> Lấy các Suất chiếu cụ thể 
    async getShowtimesFinal(movieId: string, cinemaId: string, date: string) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const showtimes = await this.showtimeModel
            .find({
                movie: movieId,
                isDeleted: false,
                status: 'ACTIVE',
                startTime: { $gte: startOfDay, $lte: endOfDay }
            })
            .populate({
                path: 'room',
                match: { cinema: cinemaId },
                select: 'name'
            })
            .select('startTime')
            .lean();

        return showtimes.filter((st: any) => st.room !== null);
    }
}