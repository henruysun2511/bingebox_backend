import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { BlogService } from "./blog.service";

const service = new BlogService();

export const createBlog = catchAsync(async (req: Request, res: Response) => {
    const result = await service.createBlog(req.body, req.user!._id.toString());
    return success(res, result, "Tạo bài viết thành công", 201);
});

export const getBlogs = catchAsync(async (req: Request, res: Response) => {
    const result = await service.getBlogs(req.query);
    return success(res, result.items, "Lấy danh sách blog thành công", 200, result.pagination);
});

export const getBlogDetail = catchAsync(async (req: Request, res: Response) => {
    const result = await service.getBlogDetail(req.params.idOrSlug);
    return success(res, result, "Lấy chi tiết bài viết thành công");
});

export const updateBlog = catchAsync(async (req: Request, res: Response) => {
    const result = await service.updateBlog(req.params.id, req.body, req.user!._id.toString());
    return success(res, result, "Cập nhật bài viết thành công");
});

export const deleteBlog = catchAsync(async (req: Request, res: Response) => {
    await service.deleteBlog(req.params.id, req.user!._id.toString());
    return success(res, null, "Xóa bài viết thành công");
});