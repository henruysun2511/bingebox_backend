import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { ShowtimeService } from "./showtime.service";

const showtimeService = new ShowtimeService();

export const getShowtimes = catchAsync(async (req: Request, res: Response) => {
  const result = await showtimeService.getShowtimes(req.query);
  return success(res, result.items, "Lấy danh sách suất chiếu thành công", 200, result.pagination);
});

export const getShowtimeDetail = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const showtime = await showtimeService.getShowtimeDetail(id);
  return success(res,showtime, "Lấy chi tiết suất chiếu thành công");
});

export const createShowtime = catchAsync(async (req: Request, res: Response) => {
  const result = await showtimeService.createShowtime(req.body, req.user!._id.toString());
  return success(res, result, "Tạo suất chiếu thành công", 201);
});

export const updateShowtime = catchAsync(async (req: Request, res: Response) => {
  const result = await showtimeService.updateShowtime(req.params.id, req.body, req.user!._id.toString());
  return success(res, result, "Cập nhật suất chiếu thành công");
});

export const deleteShowtime = catchAsync(async (req: Request, res: Response) => {
  await showtimeService.deleteShowtime(req.params.id, req.user!._id.toString());
  return success(res, null, "Xóa suất chiếu thành công");
});

export const getShowtimesByMovie = catchAsync(async (req: Request, res: Response) => {
  const { movieId } = req.params;
  const { date } = req.query; // Ví dụ: 2026-02-12

  const data = await showtimeService.getShowtimesByMovie(movieId, date as string);
  return success(res, data, "Lấy lịch chiếu theo phim thành công");
});

export const getShowtimeByCinema = catchAsync(async (req: Request, res: Response) => {
  const { cinemaId } = req.params;
  const { date } = req.query; // Ví dụ: ?date=2025-05-27
  const showtime = await showtimeService.getShowtimesByCinema(cinemaId, date as string);
  return success(res, showtime, "Lấy lịch chiếu theo rạp thành công");
});

export const getShowtimesGroupByRoom = catchAsync(async (req: Request, res: Response) => {
  const { cinemaId } = req.params;
  const { date } = req.query; // YYYY-MM-DD

  const data = await showtimeService.getShowtimesGroupByRoom(cinemaId, date as string);
  return success(res, data, "Lấy lịch chiếu theo rạp thành công");
});

