import { Request, Response } from "express";
import { GetActorListQuery } from './actor.validation';
import { AppError } from '../../utils/appError';
import { catchAsync } from '../../utils/catchAsync';
import { success } from '../../utils/response';
import { ActorService } from "./actor.service";


const actorService = new ActorService();

export const getActors = catchAsync(async (req: Request, res: Response) => {
  const result = await actorService.getActors(req.validated!.query);
  return success(res, result.items, "Lấy danh sách thành công", 200, result.pagination);
});

export const getActorDetail = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const actor = await actorService.getActorDetail(id);
  return success(res, actor, "Lấy chi tiết diễn viên thành công");
});

export const getMoviesByActor = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const movies = await actorService.getMoviesByActor(id);
    return success(res, movies, "Lấy danh sách phim của actor thành công");
  }
);

export const createActor = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
  const actor = await actorService.createActor(req.validated!.body, req.user._id.toString());
  return success(res, actor, "Tạo diễn viên thành công", 201);
});

export const updateActor = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
  const actor = await actorService.updateActor(req.params.id, req.validated!.body, req.user._id.toString());
  return success(res, actor, "Cập nhật diễn viên thành công");
});

export const deleteActor = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Vui lòng đăng nhập", 401);
  await actorService.deleteActor(req.params.id, req.user._id.toString());
  return success(res, null, "Xóa diễn viên thành công");
});
