import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { BookingService } from "./booking.service";

const bookingService = new BookingService();

export const createBooking = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString(); // Lấy từ auth middleware
    const result = await bookingService.createBooking(userId, req.body);

    return success(res, result, "Tạo đơn hàng thành công, vui lòng thanh toán trong 10 phút", 201);
});

export const getUserBookingDetail = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { id } = req.params; // bookingId

    const result = await bookingService.getUserBookingDetail(id, userId);
    return success(res, result, "Lấy chi tiết đơn hàng thành công");
});

export const getBookings = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, status } = req.query;
    const result = await bookingService.getBookings(
        Number(page), 
        Number(limit), 
        status as string
    );
    return success(res, result, "Lấy danh sách hóa đơn thành công");
});

export const getBookingDetail = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await bookingService.getBookingDetail(id);
    return success(res, result, "Lấy chi tiết hóa đơn thành công");
});