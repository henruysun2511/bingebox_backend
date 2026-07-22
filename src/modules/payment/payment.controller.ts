import { Request, Response } from "express";
import { AppError } from "../../utils/appError";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { PaymentService } from "./payment.service";

const paymentService = new PaymentService();

export const createPayment = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const { bookingId } = req.body;
    const userId = req.user._id.toString();

    const payment = await paymentService.createPayment(bookingId, userId);
    return success(res, payment, "Tạo giao dịch thành công");
});

export const sepayWebhook = catchAsync(async (req: Request, res: Response) => {
    const signature = req.headers["x-sepay-signature"] as string | undefined;
    const result = await paymentService.handleSePayWebhook(req.body, signature);
    return success(res, result, "Xử lý webhook thành công");
});

export const getPaymentStatus = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const { bookingId } = req.params;
    const userId = req.user._id.toString();
    const result = await paymentService.getPaymentStatus(bookingId, userId);
    return success(res, result, "Lấy trạng thái thanh toán thành công");
});

export const failPayment = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const { bookingId } = req.body;
    const userId = req.user._id.toString();
    const result = await paymentService.handleFailedPayment(bookingId, userId);
    return success(res, result, "Hủy thanh toán thành công");
});