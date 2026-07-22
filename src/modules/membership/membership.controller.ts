import { Request, Response } from "express";
import { AppError } from "../../utils/appError";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { MembershipService } from "./membership.service";

const membershipService = new MembershipService();

export const getMemberships = catchAsync(async (req: Request, res: Response) => {
    const result = await membershipService.getMemberships();
    return success(res, result, "Lấy danh sách hạng thành viên thành công");
});

export const createMembership = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const result = await membershipService.createMembership(req.validated!.body, req.user._id.toString());
    return success(res, result, "Tạo hạng thành viên thành công", 201);
});

export const updateMembership = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const result = await membershipService.updateMembership(
        req.params.id, 
        req.validated!.body, 
        req.user._id.toString()
    );
    return success(res, result, "Cập nhật hạng thành viên thành công");
});


export const removeMembership = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    await membershipService.deleteMembership(req.params.id, req.user._id.toString());
    return success(res, null, "Xóa hạng thành viên thành công");
});