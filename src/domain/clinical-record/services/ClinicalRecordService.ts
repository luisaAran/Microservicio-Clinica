import { v4 as uuidv4 } from 'uuid';
import {
    type ClinicalRecordByPatientFilters,
    type ClinicalRecordListFilters,
    IClinicalRecordRepository,
} from '../repositories/IClinicalRecordRepository.js';
import { CreateClinicalRecordDTO, UpdateClinicalRecordDTO } from '../dtos/ClinicalRecordDTO';
import { ClinicalRecord } from '../entities/ClinicalRecord';
import { EventPublisher } from '../../../infrastructure/messaging/EventPublisher.js';
import { PatientService } from '../../patient/services/PatientService.js';
import { TumorTypeService } from '../../tumor-type/services/TumorTypeService.js';
import { ClinicalRecordAlreadyDeletedError, ClinicalRecordNotFoundError } from '../errors/ClinicalRecordErrors.js';
import type { PaginatedResult } from '../../shared/pagination.js';

export class ClinicalRecordService {
    constructor(
        private clinicalRecordRepository: IClinicalRecordRepository,
        private patientService: PatientService,
        private tumorTypeService: TumorTypeService
    ) { }

    async createClinicalRecord(dto: CreateClinicalRecordDTO): Promise<ClinicalRecord> {
        await Promise.all([
            this.patientService.getPatientById(dto.patientId),
            this.tumorTypeService.getTumorTypeById(dto.tumorTypeId),
        ]);
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
    async listClinicalRecords(filters: ClinicalRecordListFilters): Promise<PaginatedResult<ClinicalRecord>> {
        return this.clinicalRecordRepository.findAll(filters);
    }
    async getClinicalRecordById(id: string): Promise<ClinicalRecord> {
        const record = await this.clinicalRecordRepository.findById(id);
        if (!record) {
            throw new ClinicalRecordNotFoundError(id);
        }
        return record;
    }
    async listClinicalRecordsByPatient(
        patientId: string,
        filters: ClinicalRecordByPatientFilters
    ): Promise<PaginatedResult<ClinicalRecord>> {
        return this.clinicalRecordRepository.findByPatientId(patientId, filters);
    }
    async updateClinicalRecord(id: string, dto: UpdateClinicalRecordDTO): Promise<ClinicalRecord> {
        const existingRecord = await this.getClinicalRecordById(id);
        const nextPatientId = dto.patientId ?? existingRecord.patientId;
        const nextTumorTypeId = dto.tumorTypeId ?? existingRecord.tumorTypeId;
        const referenceValidations: Promise<unknown>[] = [];
        if (dto.patientId) {
            referenceValidations.push(this.patientService.getPatientById(nextPatientId));
        }
        if (dto.tumorTypeId) {
            referenceValidations.push(this.tumorTypeService.getTumorTypeById(nextTumorTypeId));
        }
        if (referenceValidations.length) {
            await Promise.all(referenceValidations);
        }
        const updatedRecord = new ClinicalRecord(
            existingRecord.id,
            nextPatientId,
            nextTumorTypeId,
            dto.diagnosisDate ?? existingRecord.diagnosisDate,
            dto.stage ?? existingRecord.stage,
            dto.treatmentProtocol ?? existingRecord.treatmentProtocol
        );
        await this.clinicalRecordRepository.update(updatedRecord);
        await EventPublisher.getInstance().publish('ClinicalRecordUpdated', updatedRecord);
        return updatedRecord;
    }
    async deleteClinicalRecord(id: string): Promise<void> {
        const recordStatus = await this.clinicalRecordRepository.findByIdIncludingDeleted(id);
        if (!recordStatus) {
            throw new ClinicalRecordNotFoundError(id);
        }
        if (recordStatus.isDeleted) {
            throw new ClinicalRecordAlreadyDeletedError(id);
        }
        await this.clinicalRecordRepository.delete(recordStatus.record.id);
        await EventPublisher.getInstance().publish('ClinicalRecordDeleted', { id: recordStatus.record.id });
    }
}
