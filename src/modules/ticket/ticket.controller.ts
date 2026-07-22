import { Request, Response } from "express";
import { AppError } from "../../utils/appError";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { TicketService } from "./ticket.service";

const ticketService = new TicketService();

export const getUserTickets = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const userId = req.user._id.toString(); 
    const result = await ticketService.getTicketsByUser(userId, req.query);
    
    return success(res, result.items, "Lấy danh sách vé thành công", 200, result.pagination);
});

export const getTicketDetail = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ticketService.getTicketDetail(id);
    return success(res, result, "Lấy chi tiết vé thành công");
});