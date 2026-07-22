import { Request, Response } from "express";
import { AppError } from "../../utils/appError";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { TimeSlotService } from "./timeSlot.service";

const timeSlotService = new TimeSlotService();

export const getTimeSlots = catchAsync(async (req: Request, res: Response) => {
    const items = await timeSlotService.getTimeSlots();
    return success(res, items, "Lấy danh sách khung giờ thành công");
});

export const createTimeSlot = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const result = await timeSlotService.createTimeSlot(req.validated!.body, req.user._id.toString());
    return success(res, result, "Tạo khung giờ thành công", 201);
});

export const updateTimeSlot = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const result = await timeSlotService.updateTimeSlot(req.params.id, req.validated!.body, req.user._id.toString());
    return success(res, result, "Cập nhật khung giờ thành công");
});

export const deleteTimeSlot = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    await timeSlotService.deleteTimeSlot(req.params.id, req.user._id.toString());
    return success(res, null, "Xóa khung giờ thành công");
});