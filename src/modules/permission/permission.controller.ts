import { Request, Response } from "express";
import { AppError } from "../../utils/appError";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { PermissionService } from "./permission.service";

const permissionService = new PermissionService();

export const getPermissions = catchAsync(async (req: Request, res: Response) => {
    const result = await permissionService.getPermissions(req.validated!.query);
    return success(res, result.items, "Lấy danh sách quyền hạn thành công", 200, result.pagination);
});

export const createPermission = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const permission = await permissionService.createPermission(req.validated!.body, req.user._id.toString());
    return success(res, permission, "Tạo quyền hạn thành công", 201);
});

export const updatePermission = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const permission = await permissionService.updatePermission(req.params.id, req.validated!.body, req.user._id.toString());
    return success(res, permission, "Cập nhật quyền hạn thành công");
});

export const deletePermission = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    await permissionService.deletePermission(req.params.id, req.user._id.toString());
    return success(res, null, "Xóa quyền hạn thành công");
});