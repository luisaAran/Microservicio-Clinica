import { v4 as uuidv4 } from 'uuid';
import {
	type ClinicalRecordByPatientFilters,
	type ClinicalRecordListFilters,
	IClinicalRecordRepository,
} from '../repositories/IClinicalRecordRepository.js';
import { CreateClinicalRecordDTO, UpdateClinicalRecordDTO } from '../dtos/ClinicalRecordDTO.js';
import { ClinicalRecord } from '../entities/ClinicalRecord.js';
import { EventPublisher } from '../../../infrastructure/messaging/EventPublisher.js';
import { PatientService } from '../../patient/services/PatientService.js';
import { TumorTypeService } from '../../tumor-type/services/TumorTypeService.js';
import { ClinicalRecordAlreadyDeletedError, ClinicalRecordNotFoundError } from '../errors/ClinicalRecordErrors.js';
import type { PaginatedResult } from '../../shared/pagination.js';
import { PatientInactiveError } from '../../patient/errors/PatientErrors.js';
import { cacheUtils } from '../../../utils/redisClient.js';
import { logger } from '../../../utils/logger.js';

const CLINICAL_RECORD_LIST_CACHE_PREFIX = 'cache:clinical-records:list';
const CLINICAL_RECORD_DETAIL_CACHE_PREFIX = 'cache:clinical-records:detail';
const CLINICAL_RECORD_PATIENT_CACHE_PREFIX = 'cache:clinical-records:patient';

export class ClinicalRecordService {
    constructor(
        private clinicalRecordRepository: IClinicalRecordRepository,
        private patientService: PatientService,
        private tumorTypeService: TumorTypeService
    ) { }

    async createClinicalRecord(dto: CreateClinicalRecordDTO): Promise<ClinicalRecord> {
        const [patient] = await Promise.all([
            this.patientService.getPatientById(dto.patientId),
            this.tumorTypeService.getTumorTypeById(dto.tumorTypeId),
        ]);
        if (patient.status === 'Inactivo') {
            throw new PatientInactiveError(dto.patientId);
        }
        const record = new ClinicalRecord(
            uuidv4(),
            dto.patientId,
            dto.tumorTypeId,
            dto.diagnosisDate,
            dto.stage,
            dto.treatmentProtocol
        );
        await this.clinicalRecordRepository.create(record);
        await this.invalidateCache(record.id, [record.patientId]);
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
            referenceValidations.push(
                (async () => {
                    const patient = await this.patientService.getPatientById(nextPatientId);
                    if (patient.status === 'Inactivo') {
                        throw new PatientInactiveError(nextPatientId);
                    }
                })()
            );
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
        const patientIds = new Set<string>([existingRecord.patientId, updatedRecord.patientId]);
        await this.invalidateCache(updatedRecord.id, Array.from(patientIds));
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
        await this.invalidateCache(recordStatus.record.id, [recordStatus.record.patientId]);
        await EventPublisher.getInstance().publish('ClinicalRecordDeleted', { id: recordStatus.record.id });
    }

    private async invalidateCache(recordId?: string, patientIds: string[] = []): Promise<void> {
        try {
            await cacheUtils.deleteByPrefix(CLINICAL_RECORD_LIST_CACHE_PREFIX);
            if (recordId) {
                await cacheUtils.del(`${CLINICAL_RECORD_DETAIL_CACHE_PREFIX}:${recordId}`);
            }

            if (patientIds.length) {
                const uniquePatientIds = [...new Set(patientIds)];
                await Promise.all(
			uniquePatientIds.map((patientId) =>
				cacheUtils.deleteByPrefix(`${CLINICAL_RECORD_PATIENT_CACHE_PREFIX}:${patientId}`)
			)
		);
            }
        } catch (err) {
            logger.error({ err }, 'Failed to invalidate clinical record cache');
        }
    }
}
