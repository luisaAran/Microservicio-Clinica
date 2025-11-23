import type { Request, Response } from 'express';
import { TumorTypeService } from '../services/TumorTypeService.js';
import type { CreateTumorTypeDTO, UpdateTumorTypeDTO } from '../dtos/TumorTypeDTO.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { ApiError } from '../../../utils/ApiError.js';
import type { ValidatedRequest } from '../../../interface/http/middleware/validateRequest.js';
import type { TumorTypeIdParams } from '../../shared/paramSchemas.js';

export class TumorTypeController {
    constructor(private tumorTypeService: TumorTypeService) { }
    create = asyncHandler(async (req: ValidatedRequest<CreateTumorTypeDTO>, res: Response) => {
        const tumorType = await this.tumorTypeService.createTumorType(req.validated.body);
        res.status(201).json(tumorType);
    });
    update = asyncHandler(async (req: ValidatedRequest<UpdateTumorTypeDTO, TumorTypeIdParams>, res: Response) => {
        const tumorType = await this.tumorTypeService.updateTumorType(
            req.validated.params.tumorTypeId,
            req.validated.body
        );
        if (!tumorType) {
            throw new ApiError(404, 'Tumor Type not found');
        }
        res.json(tumorType);
    });
    getById = asyncHandler(async (req: ValidatedRequest<undefined, TumorTypeIdParams>, res: Response) => {
        const tumorType = await this.tumorTypeService.getTumorTypeById(req.validated.params.tumorTypeId);
        if (!tumorType) {
            throw new ApiError(404, 'Tumor Type not found');
        }
        res.json(tumorType);
    });
    list = asyncHandler(async (_req: Request, res: Response) => {
        const tumorTypes = await this.tumorTypeService.listTumorTypes();
        res.json(tumorTypes);
    });
}
