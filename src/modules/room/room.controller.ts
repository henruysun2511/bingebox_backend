import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { RoomService } from "./room.service";

const roomService = new RoomService();

export const getRooms = catchAsync(async (req: Request, res: Response) => {
    const rooms = await roomService.getRooms(req.query);
    return success(res, rooms, "Lấy danh sách phòng thành công");
});

export const createRoom = catchAsync(async (req: Request, res: Response) => {
    const room = await roomService.createRoom(req.body, req.user!._id.toString());
    return success(res, room, "Thêm phòng chiếu thành công");
});

export const updateRoom = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const room = await roomService.updateRoom(id, req.body, req.user!._id.toString());
    return success(res, room, "Cập nhật phòng chiếu thành công");
});

export const deleteRoom = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await roomService.deleteRoom(id, req.user!._id.toString());
    return success(res, null, "Xóa phòng chiếu thành công");
});


