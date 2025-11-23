import { type TumorTypeListFilters, ITumorTypeRepository } from '../repositories/ITumorTypeRepository.js';
import { CreateTumorTypeDTO, UpdateTumorTypeDTO } from '../dtos/TumorTypeDTO.js';
import { TumorType } from '../entities/TumorType.js';
import { TumorTypeAlreadyDeletedError, TumorTypeNotFoundError } from '../errors/TumorTypeErrors.js';
import type { PaginatedResult } from '../../shared/pagination.js';

export class TumorTypeService {
    constructor(private tumorTypeRepository: ITumorTypeRepository) { }
    async createTumorType(dto: CreateTumorTypeDTO): Promise<TumorType> {
        return this.tumorTypeRepository.create(dto);
    }
    async updateTumorType(id: number, dto: UpdateTumorTypeDTO): Promise<TumorType> {
        const tumorType = await this.getTumorTypeById(id);

        if (dto.name) tumorType.name = dto.name;
        if (dto.systemAffected) tumorType.systemAffected = dto.systemAffected;

        await this.tumorTypeRepository.update(tumorType);
        return tumorType;
    }

    async getTumorTypeById(id: number): Promise<TumorType> {
        const tumorType = await this.tumorTypeRepository.findById(id);
        if (!tumorType) {
            throw new TumorTypeNotFoundError(id);
        }
        return tumorType;
    }

    async listTumorTypes(filters: TumorTypeListFilters): Promise<PaginatedResult<TumorType>> {
        return this.tumorTypeRepository.findAll(filters);
    }

    async deleteTumorType(id: number): Promise<void> {
        const result = await this.tumorTypeRepository.findByIdIncludingDeleted(id);
        if (!result) {
            throw new TumorTypeNotFoundError(id);
        }
        if (result.isDeleted) {
            throw new TumorTypeAlreadyDeletedError(id);
        }
        await this.tumorTypeRepository.delete(id);
    }
}
