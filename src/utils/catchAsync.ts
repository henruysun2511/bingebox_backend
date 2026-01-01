import { NextFunction, Request, Response } from "express";

//Hàm này giúp tránh lặp code try catch trong các controller
export const catchAsync =
  (fn: Function) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };