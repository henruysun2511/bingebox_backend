import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { FormatRoomService } from "./formatRoom.service";

const formatRoomService = new FormatRoomService();

export const getFormatRooms = catchAsync(async (req: Request, res: Response) => {
    const result = await formatRoomService.getFormatRooms(req.query);
    return success(res, result.items, "Lấy danh sách thành công", 200, result.pagination);
});

export const createFormatRoom = catchAsync(async (req: Request, res: Response) => {
    const data = await formatRoomService.createFormatRoom(req.body, req.user!._id.toString());
    return success(res, data, "Tạo định dạng thành công", 201);
});

export const updateFormatRoom  = catchAsync(async (req: Request, res: Response) => {
    const data = await formatRoomService.updateFormatRoom(req.params.id, req.body, req.user!._id!.toString());
    return success(res, data, "Cập nhật định dạng thành công");
});

export const deleteFormatRoom  = catchAsync(async (req: Request, res: Response) => {
    await formatRoomService.deleteFormatRoom(req.params.id, req.user!._id!.toString());
    return success(res, null, "Xóa định dạng thành công");
});