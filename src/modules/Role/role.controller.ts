import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { RoleService } from "./role.service";

const roleService = new RoleService();

export const getRoles = catchAsync(async (req: Request, res: Response) => {
    const result = await roleService.getRoles(req.query);
    return success(res, result.items, "Lấy danh sách vai trò thành công", 200, result.pagination);
});

export const createRole = catchAsync(async (req: Request, res: Response) => {
    const role = await roleService.createRole(req.body, req.user!._id.toString());
    return success(res, role, "Tạo vai trò thành công", 201);
});

export const updateRole = catchAsync(async (req: Request, res: Response) => {
    const role = await roleService.updateRole(req.params.id, req.body, req.user!._id.toString());
    return success(res, role, "Cập nhật vai trò thành công");
});

export const deleteRole = catchAsync(async (req: Request, res: Response) => {
    await roleService.deleteRole(req.params.id, req.user!._id.toString());
    return success(res, null, "Xóa vai trò thành công");
});