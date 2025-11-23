import type { Response } from 'express';
import { ClinicalRecordService } from '../services/ClinicalRecordService.js';
import type { CreateClinicalRecordDTO, UpdateClinicalRecordDTO } from '../dtos/ClinicalRecordDTO.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import type { ValidatedRequest } from '../../../interface/http/middleware/validateRequest.js';
import type { ClinicalRecordIdParams, PatientIdParams } from '../../shared/paramSchemas.js';
import type {
    ClinicalRecordByPatientQuery,
    ClinicalRecordListQuery,
} from '../../shared/querySchemas.js';
import { buildPaginationMeta } from '../../shared/pagination.js';
import {
    buildMessageResponse,
    buildPaginatedResponse,
    buildSuccessResponse,
} from '../../../interface/http/responses/apiResponse.js';

export class ClinicalRecordController {
    constructor(private clinicalRecordService: ClinicalRecordService) { }

    create = asyncHandler(async (req: ValidatedRequest<CreateClinicalRecordDTO>, res: Response) => {
        const record = await this.clinicalRecordService.createClinicalRecord(req.validated.body);
        res.status(201).json(buildSuccessResponse('Historia clínica creada exitosamente', record));
    });

    list = asyncHandler(async (req: ValidatedRequest<undefined, undefined, ClinicalRecordListQuery>, res: Response) => {
        const result = await this.clinicalRecordService.listClinicalRecords(req.validated.query);
        res.json(
            buildPaginatedResponse('Historias clínicas obtenidas exitosamente', result.data, buildPaginationMeta(result))
        );
    });

    getById = asyncHandler(async (req: ValidatedRequest<undefined, ClinicalRecordIdParams>, res: Response) => {
        const { clinicalRecordId } = req.validated.params;
        const record = await this.clinicalRecordService.getClinicalRecordById(clinicalRecordId);
        res.json(buildSuccessResponse('Historia clínica obtenida exitosamente', record));
    });

    listByPatient = asyncHandler(
        async (
            req: ValidatedRequest<undefined, PatientIdParams, ClinicalRecordByPatientQuery>,
            res: Response
        ) => {
            const { patientId } = req.validated.params;
            const result = await this.clinicalRecordService.listClinicalRecordsByPatient(patientId, req.validated.query);
            res.json(
                buildPaginatedResponse(
                    'Historias clínicas del paciente obtenidas exitosamente',
                    result.data,
                    buildPaginationMeta(result)
                )
            );
        }
    );

    update = asyncHandler(
        async (req: ValidatedRequest<UpdateClinicalRecordDTO, ClinicalRecordIdParams>, res: Response) => {
            const { clinicalRecordId } = req.validated.params;
            const record = await this.clinicalRecordService.updateClinicalRecord(clinicalRecordId, req.validated.body);
            res.json(buildSuccessResponse('Historia clínica actualizada exitosamente', record));
        }
    );

    delete = asyncHandler(async (req: ValidatedRequest<undefined, ClinicalRecordIdParams>, res: Response) => {
        const { clinicalRecordId } = req.validated.params;
        await this.clinicalRecordService.deleteClinicalRecord(clinicalRecordId);
        res.json(buildMessageResponse('Historia clínica eliminada exitosamente'));
    });
}
