import { ApiError, ErrorCode } from '../../shared/errors/index.js';

export class TumorTypeNotFoundError extends ApiError<{ tumorTypeId: number }> {
    constructor(tumorTypeId: number) {
        super({
            statusCode: 404,
            code: ErrorCode.NOT_FOUND,
            message: `Tumor Type ${tumorTypeId} not found`,
            details: { tumorTypeId },
        });
    }
}

export class TumorTypeAlreadyDeletedError extends ApiError<{ tumorTypeId: number }> {
    constructor(tumorTypeId: number) {
        super({
            statusCode: 400,
            code: ErrorCode.BAD_REQUEST,
            message: `Tumor Type ${tumorTypeId} already deleted`,
            details: { tumorTypeId },
        });
    }
}
