export enum ErrorCode {
    NOT_FOUND = 'NOT_FOUND',
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    BAD_REQUEST = 'BAD_REQUEST',
    CONFLICT = 'CONFLICT',
}

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
    [ErrorCode.NOT_FOUND]: 'Resource not found',
    [ErrorCode.INTERNAL_ERROR]: 'Internal server error',
    [ErrorCode.VALIDATION_ERROR]: 'Validation error',
    [ErrorCode.BAD_REQUEST]: 'Bad request',
    [ErrorCode.CONFLICT]: 'Conflict detected',
};

type ApiErrorOptions<Detail> = {
    statusCode: number;
    code: ErrorCode;
    message?: string;
    details?: Detail;
    isOperational?: boolean;
    stack?: string;
};

export class ApiError<Detail = undefined> extends Error {
    statusCode: number;
    isOperational: boolean;
    code: ErrorCode;
    details?: Detail;

    constructor({ statusCode, code, message, details, isOperational = true, stack }: ApiErrorOptions<Detail>) {
        super(message ?? ERROR_MESSAGES[code]);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
