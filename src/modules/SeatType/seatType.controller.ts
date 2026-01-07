import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { SeatTypeService } from "./seatType.service";

const seatTypeService = new SeatTypeService();

export const getSeatTypes = catchAsync(async (req: Request, res: Response) => {
    const result = await seatTypeService.getAllSeatTypes();
    return success(res, result, "Lấy danh sách loại ghế thành công");
});

export const createSeatType = catchAsync(async (req: Request, res: Response) => {
    const result = await seatTypeService.createSeatType(req.body, req.user!._id.toString());
    return success(res, result, "Tạo loại ghế thành công", 201);
});

export const updateSeatType = catchAsync(async (req: Request, res: Response) => {
    const result = await seatTypeService.updateSeatType(req.params.id, req.body, req.user!._id.toString());
    return success(res, result, "Cập nhật loại ghế thành công");
});

export const deleteSeatType = catchAsync(async (req: Request, res: Response) => {
    await seatTypeService.deleteSeatType(req.params.id, req.user!._id.toString());
    return success(res, null, "Xóa loại ghế thành công");
});