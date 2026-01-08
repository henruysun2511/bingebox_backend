import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { UserService } from "./user.service";

const userService = new UserService();

export const getUserProfile = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.getUserProfile(req.user!._id.toString());
    return success(res, user, "Lấy thông tin người dùng thành công", 200);
});

export const updateUserProfile = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.updateUserProfile(req.user!._id.toString(), req.body);
    return success(res, user, "Cập nhật thông tin cá nhân thành công");
  }
);

export const assignUserRole = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params; 
    const { roleId } = req.body;
    const result = await userService.assignUserRole(id, roleId);
    return success(res, result, "Gán vai trò cho người dùng thành công");
});

export const getUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await userService.getUsers(req.query);
    return success(res, result.items, "Lấy danh sách người dùng thành công", 200, result.pagination);
});

export const toggleBlockUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isBlocked } = req.body;
    const adminId = req.user!._id.toString();

    const result = await userService.toggleBlockUser(id, isBlocked, adminId);
    
    const message = isBlocked ? "Khóa tài khoản thành công" : "Mở khóa tài khoản thành công";
    return success(res, result, message);
});
