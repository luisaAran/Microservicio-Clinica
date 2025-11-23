import { TumorType } from '../entities/TumorType.js';
import type { PaginatedResult, PaginationParams } from '../../shared/pagination.js';

export type TumorTypeListFilters = PaginationParams & {
    search?: string;
    systemAffected?: string;
};

export interface ITumorTypeRepository {
    create(tumorType: Omit<TumorType, 'id'>): Promise<TumorType>;
    update(tumorType: TumorType): Promise<void>;
    findById(id: number): Promise<TumorType | null>;
    findByIdIncludingDeleted(id: number): Promise<{ tumorType: TumorType; isDeleted: boolean } | null>;
    findAll(filters: TumorTypeListFilters): Promise<PaginatedResult<TumorType>>;
    delete(id: number): Promise<void>;
}
