import { Request, Response } from "express";
import { AppError } from "../../utils/appError";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { FoodService } from "./food.service";

const foodService = new FoodService();

export const getFoods = catchAsync(async (req: Request, res: Response) => {
    const result = await foodService.getAllFoods(req.validated!.query);
    return success(res, result, "Lấy danh sách món ăn thành công");
});

export const createFood = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const result = await foodService.createFood(req.validated!.body, req.user._id.toString());
    return success(res, result, "Thêm món ăn thành công", 201);
});

export const updateFood = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const result = await foodService.updateFood(req.params.id, req.validated!.body, req.user._id.toString());
    return success(res, result, "Cập nhật món ăn thành công");
});

export const deleteFood = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    await foodService.deleteFood(req.params.id, req.user._id.toString());
    return success(res, null, "Xóa món ăn thành công");
});