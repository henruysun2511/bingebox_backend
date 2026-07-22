import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../modules/user/user.schema";
import { ENV } from "../shares/constants/environment";
import { IUser } from "../modules/user/user.interface";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";

interface TokenPayload extends JwtPayload {
  userId: string;
}

export const authenticationMiddleware = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError("Vui lòng đăng nhập", 401);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET) as TokenPayload;

    if (!mongoose.isValidObjectId(decoded.sub)) {
      throw new AppError("Access token không hợp lệ", 401);
    }

    const user = await User.findOne({
      _id: new mongoose.Types.ObjectId(decoded.sub),
      isDeleted: false,
    }).lean<IUser>();

    if (!user) {
      throw new AppError("Người dùng không tồn tại", 404);
    }

    req.user = user;
    next();
  }
);