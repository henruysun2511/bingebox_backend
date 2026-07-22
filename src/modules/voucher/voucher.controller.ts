import { Request, Response } from "express";
import { AppError } from "../../utils/appError";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { VoucherService } from "./voucher.service";

const voucherService = new VoucherService();

export const getVouchers = catchAsync(async (req: Request, res: Response) => {
    const result = await voucherService.getVouchers(req.validated!.query);
    return success(res, result.items, "Lấy danh sách voucher thành công", 200, result.pagination);
});

export const getVoucherDetail = catchAsync(async (req: Request, res: Response) => {
    const voucher = await voucherService.getVoucherDetail(req.params.id);
    return success(res, voucher, "Lấy chi tiết voucher thành công");
});

export const createVoucher = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const voucher = await voucherService.createVoucher(req.validated!.body, req.user._id.toString());
    return success(res, voucher, "Tạo voucher thành công", 201);
});

export const updateVoucher = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const voucher = await voucherService.updateVoucher(req.params.id, req.validated!.body, req.user._id.toString());
    return success(res, voucher, "Cập nhật voucher thành công");
});

export const deleteVoucher = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    await voucherService.deleteVoucher(req.params.id, req.user._id.toString());
    return success(res, null, "Xóa voucher thành công");
});

export const updateVoucherStatus = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const { id } = req.params;
    const { status } = req.validated!.body;
    const voucher = await voucherService.updateStatus(id, status, req.user._id.toString());
    
    return success(res, voucher, "Cập nhật trạng thái voucher thành công");
});