import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../utils/appError";

declare global {
    namespace Express {
        interface Request {
            validated?: Record<string, any>;
        }
    }
}

export const validationMiddleware = (
    schema: ZodSchema,
    property: "body" | "query" | "params" = "body"
) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[property] ?? {});

        if (!result.success) {
            return next(new AppError(result.error.issues.map(e => e.message), 400));
        }

        req.validated = {
            ...req.validated,
            [property]: result.data,
        };

        next();
    };
};