import { Request, Response } from "express";
import { AppError } from "../../utils/appError";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import RoomModel from "../room/room.schema";
import SeatModel from "../seat/seat.schema";
import ShowtimeModel from "../showtime/showtime.schema";
import UserModel from "../user/user.schema";
import { TicketPriceService } from "./ticketPrice.service";

const service = new TicketPriceService();

export const createPrice = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const result = await service.createPrice(req.validated!.body, req.user._id.toString());
    return success(res, result, "Tạo cấu hình giá thành công", 201);
});

export const getPrices = catchAsync(async (req: Request, res: Response) => {
    const result = await service.getPrices(req.validated!.query);
    return success(res, result.items, "Lấy danh sách giá vé thành công", 200, result.pagination);
});

export const updatePrice = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const result = await service.updatePrice(req.params.id, req.validated!.body, req.user._id.toString());
    return success(res, result, "Cập nhật giá vé thành công");
});

export const deletePrice = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    await service.deletePrice(req.params.id, req.user._id.toString());
    return success(res, null, "Xóa cấu hình giá thành công");
});

export const previewSeatPrice = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const { seatId, showtimeId } = req.body;

    const seat = await SeatModel.findById(seatId).populate("seatType");
    if (!seat) throw new AppError("Ghế không tồn tại", 404);

    const showtime = await ShowtimeModel.findById(showtimeId).populate("timeslot");
    if (!showtime) throw new AppError("Suất chiếu không tồn tại", 404);

    const room = await RoomModel.findById(showtime.room).populate("format");
    if (!room) throw new AppError("Phòng chiếu không tồn tại", 404);

    const user = await UserModel.findById(req.user._id);
    if (!user) throw new AppError("Người dùng không tồn tại", 404);

    const result = await service.previewSeatPrice(
        seat,
        showtime,
        room,
        user
    );

    return success(res, result, "Lấy giá ghế thành công");
});