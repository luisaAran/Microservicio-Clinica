import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError, ErrorCode, ERROR_MESSAGES } from '../../../utils/ApiError.js';
import { logger } from '../../../utils/logger.js';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
    let error = err;
    const requestId = (req as any).id;
    const log = (req as any).log ?? logger;
    if (!(error instanceof ApiError)) {
        const statusCode = error instanceof ZodError ? 400 : 500;
        const code = error instanceof ZodError ? ErrorCode.VALIDATION_ERROR : ErrorCode.INTERNAL_ERROR;
        const message = error.message || ERROR_MESSAGES[code];
        error = new ApiError({ statusCode, code, message, isOperational: false, stack: err.stack });
    }
    const { statusCode, message, isOperational, stack, code, details } = error as ApiError;
    log.error({ err, requestId }, 'Unhandled API error');
    if (err instanceof ZodError) {
        return res.status(400).json({
            error: 'Validation Error',
            details: (err as ZodError).issues,
            requestId,
            code: ErrorCode.VALIDATION_ERROR,
        });
    }
    const response = {
        code: statusCode,
        errorCode: code,
        message: isOperational ? message : 'Internal Server Error',
        ...(isOperational && details ? { details } : {}),
        requestId,
        ...(process.env.NODE_ENV === 'development' && { stack }),
    };
    return res.status(statusCode).json(response);
};
