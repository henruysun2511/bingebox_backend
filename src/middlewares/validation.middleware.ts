import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { AppError } from "../utils/appError";


export const validateMiddleware =
    (
        schema: Joi.ObjectSchema,
        property: "body" | "query" | "params" = "body"
    ) =>
        (req: Request, _res: Response, next: NextFunction) => {
            const { error, value } = schema.validate(req[property] ?? {}, {
                abortEarly: false,
                allowUnknown: false,
            });

            if (error) {
                return next(
                    new AppError(
                        error.details.map(d => d.message),
                        400
                    )
                );
            }

            // lưu dữ liệu đã validate
            (req as any).validated = {
                ...(req as any).validated,
                [property]: value,
            };

            next();
        };