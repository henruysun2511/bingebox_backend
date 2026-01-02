import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { CategoryService } from "./category.service";

const categoryService = new CategoryService();

export const getCategories = catchAsync(async (req: Request, res: Response) => {
    const categories = await categoryService.getCategories();
    return success(res, categories, "Lấy danh mục thành công");
});

export const createCategory = catchAsync(async (req: Request, res: Response) => {
    const category = await categoryService.createCategory(req.body.name, req.user!._id.toString());
    return success(res, category, "Tạo danh mục thành công", 201);
});

export const updateCategory = catchAsync(async (req: Request, res: Response) => {
    const category = await categoryService.updateCategory(req.params.id, req.body.name, req.user!._id.toString());
    return success(res, category, "Cập nhật thành công");
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    await categoryService.deleteCategory(req.params.id, req.user!._id.toString());
    return success(res, null, "Xóa danh mục thành công");
});