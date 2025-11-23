import type { Response } from 'express';
import { PatientService } from '../services/PatientService.js';
import type { CreatePatientDTO, UpdatePatientDTO } from '../dtos/PatientDTO.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import type { ValidatedRequest } from '../../../interface/http/middleware/validateRequest.js';
import type { PatientIdParams } from '../../shared/paramSchemas.js';
import type { PatientListQuery } from '../../shared/querySchemas.js';
import { buildPaginationMeta } from '../../shared/pagination.js';
import {
    buildMessageResponse,
    buildPaginatedResponse,
    buildSuccessResponse,
} from '../../../interface/http/responses/apiResponse.js';

export class PatientController {
    constructor(private patientService: PatientService) { }
    create = asyncHandler(async (req: ValidatedRequest<CreatePatientDTO>, res: Response) => {
        const patient = await this.patientService.createPatient(req.validated.body);
        res.status(201).json(buildSuccessResponse('Paciente creado exitosamente', patient));
    });
    list = asyncHandler(async (req: ValidatedRequest<undefined, undefined, PatientListQuery>, res: Response) => {
        const result = await this.patientService.listPatients(req.validated.query);
        res.json(
            buildPaginatedResponse('Pacientes obtenidos exitosamente', result.data, buildPaginationMeta(result))
        );
    });
    update = asyncHandler(async (req: ValidatedRequest<UpdatePatientDTO, PatientIdParams>, res: Response) => {
        const patient = await this.patientService.updatePatient(req.validated.params.patientId, req.validated.body);
        res.json(buildSuccessResponse('Paciente actualizado exitosamente', patient));
    });
    getById = asyncHandler(async (req: ValidatedRequest<undefined, PatientIdParams>, res: Response) => {
        const patient = await this.patientService.getPatientById(req.validated.params.patientId);
        res.json(buildSuccessResponse('Paciente obtenido exitosamente', patient));
    });
    delete = asyncHandler(async (req: ValidatedRequest<undefined, PatientIdParams>, res: Response) => {
        await this.patientService.disablePatient(req.validated.params.patientId);
        res.json(buildMessageResponse('Paciente deshabilitado exitosamente'));
    });
}
