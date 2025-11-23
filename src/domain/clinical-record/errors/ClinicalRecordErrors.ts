import { ApiError, ErrorCode } from '../../shared/errors/index.js';

export class ClinicalRecordNotFoundError extends ApiError<{ clinicalRecordId: string }> {
    constructor(clinicalRecordId: string) {
        super({
            statusCode: 404,
            code: ErrorCode.NOT_FOUND,
            message: `Clinical record ${clinicalRecordId} not found`,
            details: { clinicalRecordId },
        });
    }
}

export class ClinicalRecordAlreadyDeletedError extends ApiError<{ clinicalRecordId: string }> {
    constructor(clinicalRecordId: string) {
        super({
            statusCode: 400,
            code: ErrorCode.BAD_REQUEST,
            message: `Clinical record ${clinicalRecordId} already deleted`,
            details: { clinicalRecordId },
        });
    }
}
