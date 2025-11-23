import { v4 as uuidv4 } from 'uuid';
import { IClinicalRecordRepository } from '../repositories/IClinicalRecordRepository';
import { CreateClinicalRecordDTO } from '../dtos/ClinicalRecordDTO';
import { ClinicalRecord } from '../entities/ClinicalRecord';
import { EventPublisher } from '../../../infrastructure/messaging/EventPublisher';

export class ClinicalRecordService {
    constructor(private clinicalRecordRepository: IClinicalRecordRepository) { }

    async createClinicalRecord(dto: CreateClinicalRecordDTO): Promise<ClinicalRecord> {
        const record = new ClinicalRecord(
            uuidv4(),
            dto.patientId,
            dto.tumorTypeId,
            dto.diagnosisDate,
            dto.stage,
            dto.treatmentProtocol
        );

        await this.clinicalRecordRepository.create(record);
        await EventPublisher.getInstance().publish('ClinicalRecordCreated', record);

        return record;
    }

    async listClinicalRecordsByPatient(patientId: string): Promise<ClinicalRecord[]> {
        return this.clinicalRecordRepository.findByPatientId(patientId);
    }
}
