import { Request, Response } from "express";
import { IActorQuery } from '../../types/param.type';
import { catchAsync } from '../../utils/catchAsync';
import { success } from '../../utils/response';
import { ActorService } from "./actor.service";


const actorService = new ActorService();

export const getActors = catchAsync(async (req: Request, res: Response) => {
  const result = await actorService.getActors(req.query as IActorQuery);

  return success(res, result.items, "Lấy danh sách thành công", 200, result.pagination);
});

export const getActorDetail = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const actor = await actorService.getActorDetail(id);
  return success(res, actor, "Lấy chi tiết diễn viên thành công");
});

export const createActor = catchAsync(async (req: Request, res: Response) => {
  const actor = await actorService.createActor(req.body, req.user._id.toString());
  return success(res, actor, "Tạo diễn viên thành công", 201);
});

export const updateActor = catchAsync(async (req: Request, res: Response) => {
  const actor = await actorService.updateActor(req.params.id, req.body, req.user._id.toString());
  return success(res, actor, "Cập nhật diễn viên thành công");
});

export const deleteActor = catchAsync(async (req: Request, res: Response) => {
  await actorService.deleteActor(req.params.id, req.user._id.toString());
  return success(res, null, "Xóa diễn viên thành công");
});
