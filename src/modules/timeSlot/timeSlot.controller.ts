import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { TimeSlotService } from "./timeSlot.service";

const timeSlotService = new TimeSlotService();

export const getTimeSlots = catchAsync(async (req: Request, res: Response) => {
    const items = await timeSlotService.getTimeSlots();
    return success(res, items, "Lấy danh sách khung giờ thành công");
});

export const createTimeSlot = catchAsync(async (req: Request, res: Response) => {
    const result = await timeSlotService.createTimeSlot(req.body, req.user!._id.toString());
    return success(res, result, "Tạo khung giờ thành công", 201);
});

export const updateTimeSlot = catchAsync(async (req: Request, res: Response) => {
    const result = await timeSlotService.updateTimeSlot(req.params.id, req.body, req.user!._id.toString());
    return success(res, result, "Cập nhật khung giờ thành công");
});

export const deleteTimeSlot = catchAsync(async (req: Request, res: Response) => {
    await timeSlotService.deleteTimeSlot(req.params.id, req.user!._id.toString());
    return success(res, null, "Xóa khung giờ thành công");
});