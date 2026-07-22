import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { AppError } from "../utils/appError";

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).json({
      success: false,
      messages: ["Access token đã hết hạn"],
    });
  }

  if (err instanceof JsonWebTokenError) {
    return res.status(401).json({
      success: false,
      messages: ["Access token không hợp lệ"],
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      messages: err.messages,
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    messages: ["Internal server error"],
  });
};