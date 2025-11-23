import type { Response } from 'express';
import { TumorTypeService } from '../services/TumorTypeService.js';
import type { CreateTumorTypeDTO, UpdateTumorTypeDTO } from '../dtos/TumorTypeDTO.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import type { ValidatedRequest } from '../../../interface/http/middleware/validateRequest.js';
import type { TumorTypeIdParams } from '../../shared/paramSchemas.js';
import type { TumorTypeListQuery } from '../../shared/querySchemas.js';
import { buildPaginationMeta } from '../../shared/pagination.js';
import {
    buildMessageResponse,
    buildPaginatedResponse,
    buildSuccessResponse,
} from '../../../interface/http/responses/apiResponse.js';

export class TumorTypeController {
    constructor(private tumorTypeService: TumorTypeService) { }
    create = asyncHandler(async (req: ValidatedRequest<CreateTumorTypeDTO>, res: Response) => {
        const tumorType = await this.tumorTypeService.createTumorType(req.validated.body);
        res.status(201).json(buildSuccessResponse('Tipo de tumor creado exitosamente', tumorType));
    });
    update = asyncHandler(async (req: ValidatedRequest<UpdateTumorTypeDTO, TumorTypeIdParams>, res: Response) => {
        const tumorType = await this.tumorTypeService.updateTumorType(
            req.validated.params.tumorTypeId,
            req.validated.body
        );
        res.json(buildSuccessResponse('Tipo de tumor actualizado exitosamente', tumorType));
    });
    getById = asyncHandler(async (req: ValidatedRequest<undefined, TumorTypeIdParams>, res: Response) => {
        const tumorType = await this.tumorTypeService.getTumorTypeById(req.validated.params.tumorTypeId);
        res.json(buildSuccessResponse('Tipo de tumor obtenido exitosamente', tumorType));
    });
    list = asyncHandler(async (req: ValidatedRequest<undefined, undefined, TumorTypeListQuery>, res: Response) => {
        const result = await this.tumorTypeService.listTumorTypes(req.validated.query);
        res.json(
            buildPaginatedResponse('Tipos de tumor obtenidos exitosamente', result.data, buildPaginationMeta(result))
        );
    });
    delete = asyncHandler(async (req: ValidatedRequest<undefined, TumorTypeIdParams>, res: Response) => {
        await this.tumorTypeService.deleteTumorType(req.validated.params.tumorTypeId);
        res.json(buildMessageResponse('Tipo de tumor eliminado exitosamente'));
    });
}
