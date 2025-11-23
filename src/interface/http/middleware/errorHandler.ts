import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../../../utils/ApiError.js';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let error = err;

    if (!(error instanceof ApiError)) {
        const statusCode = error instanceof ZodError ? 400 : 500;
        const message = error.message || 'Internal Server Error';
        error = new ApiError(statusCode, message, false, err.stack);
    }

    const { statusCode, message, isOperational, stack } = error as ApiError;

    if (process.env.NODE_ENV === 'development') {
        console.error(err);
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            error: 'Validation Error',
            details: err.errors,
        });
    }

    const response = {
        code: statusCode,
        message: isOperational ? message : 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack }),
    };

    res.status(statusCode).json(response);
};
