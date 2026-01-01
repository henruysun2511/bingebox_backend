import { Response } from "express";

export function success(
  res: Response,
  data: any,
  message: string | null = null,
  statusCode = 200,
  pagination?: any
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination: pagination ?? null,
  });
}

export function fail(
  res: Response,
  messages: string[],
  statusCode = 400
) {
  return res.status(statusCode).json({
    success: false,
    messages,
  });
}