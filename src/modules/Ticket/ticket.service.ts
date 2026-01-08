import mongoose from "mongoose";
import { AppError } from "../../utils/appError";
import { buildPagination } from "../../utils/buildPagination";
import TicketModel from "./ticket.schema";

export class TicketService {
    private ticketModel = TicketModel;

    async getTicketsByUser(userId: string, query: any) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new AppError("User ID không hợp lệ", 400);
        }

        const { page, limit, skip } = buildPagination(query);
        const filter = { user: userId, isDeleted: false }; // Khai báo filter dùng chung

        const [items, total] = await Promise.all([
            this.ticketModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate({
                    path: "showtime",
                    select: "startTime room",
                    populate: [
                        { path: "movie", select: "name subtitle" },
                        {
                            path: "room",
                            select: "name cinema",
                            populate: { path: "cinema", select: "name" } // Cinema nằm trong Room
                        }
                    ]
                })
                .populate("seat", "code")
                .select("showtime seat qrCode createdAt")
                .lean(),
            this.ticketModel.countDocuments(filter),
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

    //     {
    //   "status": "success",
    //   "message": "Lấy danh sách vé thành công",
    //   "data": [
    //     {
    //       "_id": "65f123abc...",
    //       "showtime": {
    //         "_id": "65f456def...",
    //         "startTime": "2025-05-27T17:40:00.000Z",
    //         "movie": {
    //           "title": "XỨ CÁT: PHẦN 2"
    //         },
    //         "room": {
    //           "name": "Phòng 7",
    //           "cinema": {
    //             "name": "Bingebox Cinema Chùa Bộc"
    //           }
    //         }
    //       },
    //       "seat": {
    //         "code": "C13"
    //       },
    //       "qrCode": "https://api.qrserver.com/v1/create-qr-code/?data=TICKET_C13_...",
    //       "createdAt": "2025-05-20T10:00:00.000Z"
    //     }
    //   ],
    //   "pagination": {
    //     "page": 1,
    //     "limit": 10,
    //     "totalItems": 15,
    //     "totalPages": 2
    //   }
    // }

    async getTicketDetail(ticketId: string, userId: string) {
        if (!mongoose.Types.ObjectId.isValid(ticketId)) {
            throw new AppError("ID vé không hợp lệ", 400);
        }

        const ticket = await this.ticketModel
            .findOne({ _id: ticketId, user: userId, isDeleted: false })
            .populate({
                path: "showtime",
                populate: [
                    { path: "movie", select: "name subtitle format" },
                    {
                        path: "room",
                        select: "name cinema",
                        populate: { path: "cinema", select: "name" }
                    }
                ]
            })
            .populate({
                path: "seat",
                select: "code seatType",
                populate: { path: "seatType", select: "name" } // Để hiển thị "Standard/VIP" thay vì ID
            })
            .lean();

        if (!ticket) {
            throw new AppError("Không tìm thấy thông tin vé", 404);
        }

        return ticket;
    }

    //     {
    //   "status": "success",
    //   "message": "Lấy chi tiết vé thành công",
    //   "data": {
    //     "_id": "65f123abc...",
    //     "showtime": {
    //       "startTime": "2025-05-27T17:40:00.000Z",
    //       "movie": {
    //         "title": "XỨ CÁT: PHẦN 2",
    //         "subtitle": "SUBTITLE", 
    //         "format": ["IMAX", "2D"]
    //       },
    //       "room": {
    //         "name": "Phòng 7",
    //         "cinema": {
    //           "name": "Bingebox Cinema Chùa Bộc"
    //         }
    //       }
    //     },
    //     "seat": {
    //       "code": "C13",
    //       "row": 3,
    //       "number": 13,
    //       "seatType": {
    //         "name": "Standard"
    //       }
    //     },
    //     "qrCode": "...",
    //     "status": "PAID",
    //     "totalPrice": 120000,
    //     "createdAt": "2025-05-20T10:00:00.000Z"
    //   }
    // }
}