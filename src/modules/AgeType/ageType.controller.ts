import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { AgeTypeService } from "./ageType.service";

const service = new AgeTypeService();

export const getAgeTypes = catchAsync(async (req: Request, res: Response) => {
    const result = await service.getAgeTypes(req.query);
    return success(res, result, "Lấy danh sách thành công");
});

export const createAgeType = catchAsync(async (req: Request, res: Response) => {
    const result = await service.createAgeType(req.body, req.user!._id.toString());
    return success(res, result, "Tạo thành công", 201);
});

export const updateAgeType = catchAsync(async (req: Request, res: Response) => {
    const result = await service.updateAgeType(req.params.id, req.body, req.user!._id.toString());
    return success(res, result, "Cập nhật thành công");
});

export const removeAgeType = catchAsync(async (req: Request, res: Response) => {
    await service.deleteAgeType(req.params.id, req.user!._id.toString());
    return success(res, null, "Xóa thành công");
});