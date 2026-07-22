import { Request, Response } from "express";
import { AppError } from "../../utils/appError";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { RoomService } from "./room.service";

const roomService = new RoomService();

export const getRooms = catchAsync(async (req: Request, res: Response) => {
    const rooms = await roomService.getRooms(req.validated!.query);
    return success(res, rooms, "Lấy danh sách phòng thành công");
});

export const createRoom = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const room = await roomService.createRoom(req.validated!.body, req.user._id.toString());
    return success(res, room, "Thêm phòng chiếu thành công");
});

export const updateRoom = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const { id } = req.params;
    const room = await roomService.updateRoom(id, req.validated!.body, req.user._id.toString());
    return success(res, room, "Cập nhật phòng chiếu thành công");
});

export const deleteRoom = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const { id } = req.params;
    await roomService.deleteRoom(id, req.user._id.toString());
    return success(res, null, "Xóa phòng chiếu thành công");
});

export const updateRoomStatus = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const { id } = req.params;
    const { status } = req.validated!.body;
    const room = await roomService.updateStatus(id, status, req.user._id.toString());
    
    return success(res, room, "Cập nhật trạng thái phòng thành công");
});


