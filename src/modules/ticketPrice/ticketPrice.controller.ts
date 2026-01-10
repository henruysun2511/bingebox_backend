import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { TicketPriceService } from "./ticketPrice.service";

const service = new TicketPriceService();

export const createPrice = catchAsync(async (req: Request, res: Response) => {
    const result = await service.createPrice(req.body, req.user!._id.toString());
    return success(res, result, "Tạo cấu hình giá thành công", 201);
});

export const getPrices = catchAsync(async (req: Request, res: Response) => {
    const result = await service.getPrices(req.query);
    return success(res, result, "Lấy danh sách giá vé thành công");
});

export const updatePrice = catchAsync(async (req: Request, res: Response) => {
    const result = await service.updatePrice(req.params.id, req.body, req.user!._id.toString());
    return success(res, result, "Cập nhật giá vé thành công");
});

export const deletePrice = catchAsync(async (req: Request, res: Response) => {
    await service.deletePrice(req.params.id, req.user!._id.toString());
    return success(res, null, "Xóa cấu hình giá thành công");
});