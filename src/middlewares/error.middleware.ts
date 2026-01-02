import { NextFunction, Request, Response } from "express";
import { AppError } from './../utils/appError';

export function errorHandlerMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
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
}