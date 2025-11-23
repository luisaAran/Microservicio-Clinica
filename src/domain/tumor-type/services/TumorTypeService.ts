import { type TumorTypeListFilters, ITumorTypeRepository } from '../repositories/ITumorTypeRepository.js';
import { CreateTumorTypeDTO, UpdateTumorTypeDTO } from '../dtos/TumorTypeDTO.js';
import { TumorType } from '../entities/TumorType.js';
import { TumorTypeAlreadyDeletedError, TumorTypeNotFoundError } from '../errors/TumorTypeErrors.js';
import type { PaginatedResult } from '../../shared/pagination.js';
import { cacheUtils } from '../../../utils/redisClient.js';
import { logger } from '../../../utils/logger.js';

const TUMOR_TYPE_LIST_CACHE_PREFIX = 'cache:tumor-types:list';
const TUMOR_TYPE_DETAIL_CACHE_PREFIX = 'cache:tumor-types:detail';

export class TumorTypeService {
    constructor(private tumorTypeRepository: ITumorTypeRepository) { }
    async createTumorType(dto: CreateTumorTypeDTO): Promise<TumorType> {
        const tumorType = await this.tumorTypeRepository.create(dto);
        await this.invalidateCache(tumorType.id);
        return tumorType;
    }
    async updateTumorType(id: number, dto: UpdateTumorTypeDTO): Promise<TumorType> {
        const tumorType = await this.getTumorTypeById(id);

        if (dto.name) tumorType.name = dto.name;
        if (dto.systemAffected) tumorType.systemAffected = dto.systemAffected;

        await this.tumorTypeRepository.update(tumorType);
        await this.invalidateCache(tumorType.id);
        return tumorType;
    }

    async getTumorTypeById(id: number): Promise<TumorType> {
        const result = await this.tumorTypeRepository.findByIdIncludingDeleted(id);
        if (!result) {
            throw new TumorTypeNotFoundError(id);
        }
        if (result.isDeleted) {
            throw new TumorTypeAlreadyDeletedError(id);
        }
        return result.tumorType;
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
        await this.invalidateCache(id);
    }

    private async invalidateCache(id?: number): Promise<void> {
        try {
            await cacheUtils.deleteByPrefix(TUMOR_TYPE_LIST_CACHE_PREFIX);
            if (typeof id !== 'undefined') {
                await cacheUtils.del(`${TUMOR_TYPE_DETAIL_CACHE_PREFIX}:${id}`);
            }
        } catch (err) {
            logger.error({ err }, 'Failed to invalidate tumor type cache');
        }
    }
}
