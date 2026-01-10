import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { QuickTicketBuyingService } from "./quickTicketBuying.service";

const quickTicketBuyingService = new QuickTicketBuyingService();

export const getCinemasByMovie = catchAsync(async (req: Request, res: Response) => {
    const { movieId } = req.params;
    const result = await quickTicketBuyingService.getCinemasByMovie(movieId);
    return success(res, result, "Lấy danh sách rạp thành công");
});

export const getDatesByMovieAndCinema = catchAsync(async (req: Request, res: Response) => {
    const { movieId, cinemaId } = req.query;
    const result = await quickTicketBuyingService.getDatesByMovieAndCinema(movieId as string, cinemaId as string);
    return success(res, result, "Lấy danh sách ngày chiếu thành công");
});

export const getShowtimesFinal = catchAsync(async (req: Request, res: Response) => {
    const { movieId, cinemaId, date } = req.query;
    const result = await quickTicketBuyingService.getShowtimesFinal(movieId as string, cinemaId as string, date as string);
    return success(res, result, "Lấy danh sách suất chiếu thành công");
});