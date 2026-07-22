import { Request, Response } from "express";
import { AppError } from "../../utils/appError";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { CinemaService } from "./cinema.service";

const cinemaService = new CinemaService();

export const getCinemas = catchAsync(async (req: Request, res: Response) => {
    const result = await cinemaService.getCinemas(req.validated!.query);
    return success(res, result.items, "Lấy danh sách rạp thành công", 200, result.pagination);
});

export const getCinemaDetail = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const cinema = await cinemaService.getCinemaDetail(id);
  return success(res, cinema, "Lấy chi tiết phim thành công");
});

export const createCinema = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const cinema = await cinemaService.createCinema(req.validated!.body, req.user._id.toString());
    return success(res, cinema, "Tạo rạp thành công", 201);
});

export const updateCinema = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const cinema = await cinemaService.updateCinema(req.params.id, req.validated!.body, req.user._id.toString());
    return success(res, cinema, "Cập nhật rạp thành công");
});

export const deleteCinema = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    await cinemaService.deleteCinema(req.params.id, req.user._id.toString());
    return success(res, null, "Xóa rạp thành công");
});