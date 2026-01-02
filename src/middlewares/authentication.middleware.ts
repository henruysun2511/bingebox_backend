import { IUser } from "@/types/object.type";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../modules/user/user.schema";
import { ENV } from "../shares/constants/enviroment";
import { AppError } from "../utils/appError";

interface TokenPayload extends JwtPayload {
  userId: string;
}

export const authenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError("Vui lòng đăng nhập", 401);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      ENV.ACCESS_TOKEN_SECRET
    ) as TokenPayload;

    const user = await User.findOne({
      _id: decoded.userId,
      isDeleted: false,
    }).lean<IUser>();

    if (!user) {
      throw new AppError("Người dùng không tồn tại", 404);
    }

    //Gắn user vào request
    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Access token đã hết hạn", 401));
    }

    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Access token không hợp lệ", 401));
    }

    next(error);
  }
};