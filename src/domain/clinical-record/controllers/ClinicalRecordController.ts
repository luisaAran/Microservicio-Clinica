import type { Response } from 'express';
import { ClinicalRecordService } from '../services/ClinicalRecordService.js';
import type { CreateClinicalRecordDTO } from '../dtos/ClinicalRecordDTO.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import type { ValidatedRequest } from '../../../interface/http/middleware/validateRequest.js';
import type { PatientIdParams } from '../../shared/paramSchemas.js';

export class ClinicalRecordController {
    constructor(private clinicalRecordService: ClinicalRecordService) { }

    create = asyncHandler(async (req: ValidatedRequest<CreateClinicalRecordDTO>, res: Response) => {
        const record = await this.clinicalRecordService.createClinicalRecord(req.validated.body);
        res.status(201).json(record);
    });

    listByPatient = asyncHandler(async (req: ValidatedRequest<undefined, PatientIdParams>, res: Response) => {
        const { patientId } = req.validated.params;
        const records = await this.clinicalRecordService.listClinicalRecordsByPatient(patientId);
        res.json(records);
    });
}
