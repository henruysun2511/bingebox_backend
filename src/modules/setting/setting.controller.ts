import { Request, Response } from "express";
import { AppError } from "../../utils/appError";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { SettingService } from "./setting.service";

const settingService = new SettingService();

export const getSetting = catchAsync(async (req: Request, res: Response) => {
    const setting = await settingService.getSetting();
    return success(res, setting, "Lấy cấu hình hệ thống thành công");
});

export const updateSetting = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const setting = await settingService.updateSetting(req.validated!.body, req.user._id.toString());
    return success(res, setting, "Cập nhật cấu hình thành công");
});