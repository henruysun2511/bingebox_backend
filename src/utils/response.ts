import { Response } from "express";

export interface PaginationInfo {
  page?: number;
  currentPage?: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export function success<T>(
  res: Response,
  data: T,
  message: string | null = null,
  statusCode = 200,
  pagination?: PaginationInfo
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