import { ApiError, ErrorCode } from '../../shared/errors/index.js';

export class PatientNotFoundError extends ApiError<{ patientId: string }> {
    constructor(patientId: string) {
        super({
            statusCode: 404,
            code: ErrorCode.NOT_FOUND,
            message: `Patient ${patientId} not found`,
            details: { patientId },
        });
    }
}

export class PatientAlreadyDeletedError extends ApiError<{ patientId: string }> {
    constructor(patientId: string) {
        super({
            statusCode: 400,
            code: ErrorCode.BAD_REQUEST,
            message: `Patient ${patientId} already deleted`,
            details: { patientId },
        });
    }
}

export class PatientInactiveError extends ApiError<{ patientId: string }> {
    constructor(patientId: string) {
        super({
            statusCode: 400,
            code: ErrorCode.BAD_REQUEST,
            message: `Patient ${patientId} is inactive`,
            details: { patientId },
        });
    }
}