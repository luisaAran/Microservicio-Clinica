import type { Response } from 'express';
import { PatientService } from '../services/PatientService.js';
import type { CreatePatientDTO, UpdatePatientDTO } from '../dtos/PatientDTO.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { ApiError } from '../../../utils/ApiError.js';
import type { ValidatedRequest } from '../../../interface/http/middleware/validateRequest.js';
import type { PatientIdParams } from '../../shared/paramSchemas.js';

export class PatientController {
    constructor(private patientService: PatientService) { }

    create = asyncHandler(async (req: ValidatedRequest<CreatePatientDTO>, res: Response) => {
        const patient = await this.patientService.createPatient(req.validated.body);
        res.status(201).json(patient);
    });

    update = asyncHandler(async (req: ValidatedRequest<UpdatePatientDTO, PatientIdParams>, res: Response) => {
        const patient = await this.patientService.updatePatient(req.validated.params.patientId, req.validated.body);
        if (!patient) {
            throw new ApiError(404, 'Patient not found');
        }
        res.json(patient);
    });

    getById = asyncHandler(async (req: ValidatedRequest<undefined, PatientIdParams>, res: Response) => {
        const patient = await this.patientService.getPatientById(req.validated.params.patientId);
        if (!patient) {
            throw new ApiError(404, 'Patient not found');
        }
        res.json(patient);
    });

    delete = asyncHandler(async (req: ValidatedRequest<undefined, PatientIdParams>, res: Response) => {
        await this.patientService.disablePatient(req.validated.params.patientId);
        res.status(204).send();
    });
}
