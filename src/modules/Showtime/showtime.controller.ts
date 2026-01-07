import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { ShowtimeService } from "./showtime.service";

const showtimeService = new ShowtimeService();

export const getShowtimes = catchAsync(async (req: Request, res: Response) => {
  const result = await showtimeService.getShowtimes(req.query);
  return success(res, result.items, "Lấy danh sách suất chiếu thành công", 200, result.pagination);
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