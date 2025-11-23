import { ITumorTypeRepository } from '../repositories/ITumorTypeRepository';
import { CreateTumorTypeDTO, UpdateTumorTypeDTO } from '../dtos/TumorTypeDTO';
import { TumorType } from '../entities/TumorType';

export class TumorTypeService {
    constructor(private tumorTypeRepository: ITumorTypeRepository) { }
    async createTumorType(dto: CreateTumorTypeDTO): Promise<TumorType> {
        return this.tumorTypeRepository.create(dto);
    }
    async updateTumorType(id: number, dto: UpdateTumorTypeDTO): Promise<TumorType | null> {
        const tumorType = await this.tumorTypeRepository.findById(id);
        if (!tumorType) return null;

        if (dto.name) tumorType.name = dto.name;
        if (dto.systemAffected) tumorType.systemAffected = dto.systemAffected;

        await this.tumorTypeRepository.update(tumorType);
        return tumorType;
    }

    async getTumorTypeById(id: number): Promise<TumorType | null> {
        return this.tumorTypeRepository.findById(id);
    }

    async listTumorTypes(): Promise<TumorType[]> {
        return this.tumorTypeRepository.findAll();
    }
}
