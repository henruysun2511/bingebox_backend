import { NextFunction, Request, Response } from "express";
import Role from "../modules/Role/role.schema";
import { AppError } from "../utils/appError";

export const authorizationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("Vui lòng đăng nhập", 401);
    }

    const role = await Role.findById(req.user.role).populate({
      path: "permissions",
      select: "path method"
    });

    if (!role) {
      throw new AppError("Không tìm thấy role của người dùng", 403);
    }

    const currentPermission = `${req.method}:${req.route.path}`;

    const allowed = role.permissions.some((p: any) => {
      return `${p.method}:${p.path}` === currentPermission;
    });

    if (!allowed) {
      throw new AppError("Bạn không có quyền truy cập endpoint này", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};