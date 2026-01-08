import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { CommentService } from "./comment.service";

const commentService = new CommentService();

export const createComment = catchAsync(async (req: Request, res: Response) => {
    const result = await commentService.createComment(req.body, req.user!._id.toString());
    return success(res, result, "Gửi bình luận thành công", 201);
});

export const getRootComments = catchAsync(async (req: Request, res: Response) => {
    const { movieId } = req.params;
    const result = await commentService.getRootComments(movieId, req.query);
    return success(res, result.items, "Lấy bình luận thành công", 200, result.pagination);
});

export const getReplies = catchAsync(async (req: Request, res: Response) => {
    const { parentId } = req.params;
    const result = await commentService.getReplies(parentId, req.query);
    return success(res, result.items, "Lấy phản hồi thành công", 200, result.pagination);
});

export const updateComment = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { content } = req.body;
    const result = await commentService.updateComment(id, req.user!._id.toString(), content);
    return success(res, result, "Cập nhật bình luận thành công");
});

export const deleteComment = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await commentService.deleteComment(id, req.user!._id.toString());
    return success(res, null, "Xóa bình luận thành công");
});

export const toggleLike = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await commentService.toggleLike(id, req.user!._id.toString());
    return success(res, result, result.isLiked ? "Đã thích" : "Đã bỏ thích");
});