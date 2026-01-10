import { BaseStatusEnum, BookingStatusEnum, TicketStatusEnum } from "../../shares/constants/enum";
import BookingModel from "../Booking/booking.schema";
import ShowtimeModel from "../Showtime/showtime.schema";
import TicketModel from "../Ticket/ticket.schema";
import UserModel from "../User/user.schema";
import { buildDateFilter } from "./dashboard.query";

export class DashboardService {
    constructor(
        private bookingModel = BookingModel,
        private ticketModel = TicketModel,
        private userModel = UserModel,
        private showtimeModel = ShowtimeModel,
    ) { }

    async getRevenueStatsByMonth(from?: Date, to?: Date) {
        return this.bookingModel.aggregate([
            {
                $match: {
                    bookingStatus: BookingStatusEnum.SUCCESS,
                    ...buildDateFilter(from, to)
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    totalRevenue: { $sum: "$finalAmount" },
                    grossRevenue: { $sum: "$totalAmount" },
                    totalBookings: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    time: "$_id",
                    _id: 0,
                    totalRevenue: 1,
                    grossRevenue: 1,
                    totalBookings: 1
                }
            }
        ]);
    }

    async getTicketSalesByMonth(from?: Date, to?: Date) {
        return this.ticketModel.aggregate([
            {
                $match: {
                    status: TicketStatusEnum.PAID,
                    ...buildDateFilter(from, to)
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    soldTickets: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $project: { time: "$_id", soldTickets: 1, _id: 0 } }
        ]);
    }

    async getTopMoviesByMonth(from?: Date, to?: Date) {
        return this.bookingModel.aggregate([
            {
                $match: {
                    bookingStatus: BookingStatusEnum.SUCCESS,
                    ...buildDateFilter(from, to)
                }
            },
            {
                $lookup: {
                    from: "showtimes",
                    localField: "showtime",
                    foreignField: "_id",
                    as: "st"
                }
            },
            { $unwind: "$st" },
            {
                $lookup: {
                    from: "movies",
                    localField: "st.movie",
                    foreignField: "_id",
                    as: "mv"
                }
            },
            { $unwind: "$mv" },
            {
                $group: {
                    _id: {
                        time: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                        movieId: "$mv._id",
                        movieName: "$mv.name"
                    },
                    revenue: { $sum: "$finalAmount" }
                }
            },
            { $sort: { "_id.time": 1, revenue: -1 } },
            {
                $group: {
                    _id: "$_id.time",
                    movies: {
                        $push: {
                            movieId: "$_id.movieId",
                            name: "$_id.movieName",
                            revenue: "$revenue"
                        }
                    }
                }
            },
            {
                $project: {
                    time: "$_id",
                    movies: { $slice: ["$movies", 5] },
                    _id: 0
                }
            }
        ]);
    }

    async getTop5SpendingCustomers() {
        return this.userModel.find({ role: "USER" }) // Chỉ lấy khách hàng, bỏ qua admin
            .sort({ totalSpending: -1 }) // Sắp xếp giảm dần
            .limit(5)
            .select("fullName email totalSpending avatar membership")
            .populate("membership", "name"); // Hiện hạng thẻ để biết họ là ai
    }

    async getCustomerGrowthByMonth(from?: Date, to?: Date) {
        return this.userModel.aggregate([
            {
                // 1. Lọc theo thời gian tạo tài khoản trước
                $match: buildDateFilter(from, to)
            },
            {
                // 2. Kết nối với bảng roles để kiểm tra tên role
                $lookup: {
                    from: "roles", // Tên collection chứa Role
                    localField: "role",
                    foreignField: "_id",
                    as: "roleData"
                }
            },
            { $unwind: "$roleData" },
            {
                // 3. Chỉ lấy những người dùng có role là USER
                $match: {
                    "roleData.name": "USER"
                }
            },
            {
                // 4. Gom nhóm theo tháng
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    newUsers: { $sum: 1 }
                }
            },
            {
                // 5. Sắp xếp theo thứ tự thời gian tăng dần
                $sort: { _id: 1 }
            },
            {
                // 6. Định dạng lại đầu ra cho Frontend dễ dùng
                $project: {
                    time: "$_id",
                    newUsers: 1,
                    _id: 0
                }
            }
        ]);
    }

    async getMembershipDistribution() {
        return this.userModel.aggregate([
            {
                $group: {
                    _id: "$membership",
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "memberships",
                    localField: "_id",
                    foreignField: "_id",
                    as: "m"
                }
            },
            { $unwind: { path: "$m", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    name: { $ifNull: ["$m.name", "N/A"] },
                    count: 1,
                    _id: 0
                }
            }
        ]);
    }

    async getTicketCountByHour(from?: Date, to?: Date) {
        return this.ticketModel.aggregate([
            {
                // 1. Chỉ lấy vé đã thanh toán
                $match: { status: TicketStatusEnum.PAID }
            },
            {
                // 2. Kết nối với bảng showtimes để lấy startTime
                $lookup: {
                    from: "showtimes",
                    localField: "showtime",
                    foreignField: "_id",
                    as: "st"
                }
            },
            { $unwind: "$st" },
            {
                // 3. Lọc theo khoảng thời gian nếu cần
                $match: (from || to) ? {
                    "st.startTime": {
                        ...(from && { $gte: from }),
                        ...(to && { $lte: to })
                    }
                } : {}
            },
            {
                // 4. Gom nhóm theo định dạng giờ (HH:00)
                $group: {
                    _id: {
                        $dateToString: { format: "%H:00", date: "$st.startTime" }
                    },
                    ticketCount: { $sum: 1 }
                }
            },
            {
                // 5. Sắp xếp theo giờ tăng dần (08:00 -> 23:00)
                $sort: { _id: 1 }
            },
            {
                $project: {
                    timeSlot: "$_id",
                    ticketCount: 1,
                    _id: 0
                }
            }
        ]);
    }

    async getOccupancyStatsByMonth() {
        return this.showtimeModel.aggregate([
            // 1. Lấy các suất chiếu đang hoạt động
            { $match: { status: BaseStatusEnum.ACTIVE } },

            // 2. Kết nối với bảng Room để lấy tổng số ghế (totalSeats)
            {
                $lookup: {
                    from: "rooms",
                    localField: "room",
                    foreignField: "_id",
                    as: "roomData"
                }
            },
            { $unwind: "$roomData" },

            // 3. Kết nối với bảng Ticket để đếm số vé đã thanh toán (PAID)
            {
                $lookup: {
                    from: "tickets",
                    localField: "_id",
                    foreignField: "showtime",
                    as: "ticketData"
                }
            },

            // 4. Tính toán số ghế đã bán và nhóm theo tháng
            {
                $project: {
                    month: { $dateToString: { format: "%Y-%m", date: "$startTime" } },
                    totalSeatsInShowtime: "$roomData.totalSeats",
                    occupiedSeats: {
                        $size: {
                            $filter: {
                                input: "$ticketData",
                                as: "t",
                                cond: { $eq: ["$$t.status", TicketStatusEnum.PAID] } // Chỉ tính vé đã thanh toán
                            }
                        }
                    }
                }
            },

            // 5. Gom nhóm theo tháng để tính trung bình cộng
            {
                $group: {
                    _id: "$month",
                    avgOccupiedSeats: { $avg: "$occupiedSeats" },
                    avgTotalSeats: { $avg: "$totalSeatsInShowtime" }
                }
            },

            // 6. Tính tỷ lệ phần trăm cuối cùng
            {
                $addFields: {
                    rate: {
                        $cond: [
                            { $gt: ["$avgTotalSeats", 0] },
                            { $multiply: [{ $divide: ["$avgOccupiedSeats", "$avgTotalSeats"] }, 100] },
                            0
                        ]
                    }
                }
            },

            // 7. Sắp xếp theo thời gian
            { $sort: { _id: 1 } },
            { $project: { time: "$_id", rate: { $round: ["$rate", 2] }, _id: 0 } }
        ]);
    }
}