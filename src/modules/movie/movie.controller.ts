import { Request, Response } from "express";
import { AppError } from "../../utils/appError";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "../../utils/response";
import { delCacheByPattern } from "../../configs/redis.config";
import { MovieService } from "./movie.service";

const movieService = new MovieService();

export const getMovies = catchAsync(async (req: Request, res: Response) => {
  const result = await movieService.getMovies(req.validated!.query);
    return success(res, result.items, "Lấy danh sách phim thành công", 200, result.pagination);
});

export const getMoviesForAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await movieService.getMoviesForAdmin(req.validated!.query);
    return success(res, result.items, "Lấy danh sách phim cho admin thành công", 200, result.pagination);
});

export const getActorsByMovie = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const actors = await movieService.getActorsByMovie(id);
  return success(res, actors, "Lấy danh sách diễn viên theo phim thành công");
});

export const getMovieDetail = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const movie = await movieService.getMovieDetail(id);
  return success(res, movie, "Lấy chi tiết phim thành công");
});

export const createMovie = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const movie = await movieService.createMovie(req.validated!.body, req.user._id.toString());
    await delCacheByPattern("movies:*");
    return success(res, movie, "Tạo phim thành công", 201);
});

export const updateMovie = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
    const movie = await movieService.updateMovie(req.params.id, req.validated!.body, req.user._id.toString());
    await delCacheByPattern("movies:*");
    return success(res, movie, "Cập nhật phim thành công");
});

export const deleteMovie = catchAsync(async (req: Request, res: Response) => {
  await movieService.deleteMovie(req.params.id, req.user!._id.toString());
  await delCacheByPattern("movies:*");
  return success(res, null, "Xóa phim thành công");
});

export const getWatchedMovies = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const movies = await movieService.getWatchedMovies(userId);

    return success(res,  movies, "Lấy danh sách phim đã xem thành công");
});

export const toggleLikeMovie = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params; 
    const userId = req.user!._id.toString();

    const result = await movieService.toggleLikeMovie(id, userId);
    return success(res, result, result.isLiked ? "Đã thêm vào danh sách yêu thích" : "Đã xóa khỏi danh sách yêu thích");
});

export const getMyFavoriteMovies = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const favoriteMovies = await movieService.getMyFavoriteMovies(userId);

    return success(res, favoriteMovies, "Lấy danh sách phim yêu thích thành công");
});