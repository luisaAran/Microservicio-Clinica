import { TumorType } from '../entities/TumorType';

export interface ITumorTypeRepository {
    create(tumorType: Omit<TumorType, 'id'>): Promise<TumorType>;
    update(tumorType: TumorType): Promise<void>;
    findById(id: number): Promise<TumorType | null>;
    findAll(): Promise<TumorType[]>;
}
