import { NextFunction, Request, Response } from "express";
import * as log4js from "log4js";
import { basename, extname } from "path";
import { ValidateError } from "tsoa";

const log = log4js.getLogger(basename(__filename, extname(__filename)));

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): Response | void {
    if (err instanceof ValidateError) {
        log.warn(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(422).json({
            message: "Validation Failed",
            details: err?.fields
        });
    }
    if (err instanceof Error) {
        const status = (err as any).status || (err as any).statusCode || 500;
        const message = err.message;
        if (err.stack) {
            log.error({
                status,
                message,
                stack: err.stack
            });
        } else {
            log.error({
                status,
                message,
                error: err
            });
        }
        return res
            .status(status)
            .json({
                error: err.message || "Internal Server Error"
            });
    }
    next();
}