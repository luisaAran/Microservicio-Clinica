import { ApiError, ErrorCode } from '../../../utils/ApiError.js';
export { ApiError, ErrorCode, ERROR_MESSAGES } from '../../../utils/ApiError.js';
export class ValidationRequestError<Detail = unknown> extends ApiError<Detail> {
    constructor(message: string, details?: Detail) {
        super({
            statusCode: 400,
            code: ErrorCode.VALIDATION_ERROR,
            message,
            details,
        });
    }
}
