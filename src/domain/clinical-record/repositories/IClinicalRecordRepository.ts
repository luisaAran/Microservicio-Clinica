import { ClinicalRecord } from '../entities/ClinicalRecord.js';
import type { PaginatedResult, PaginationParams } from '../../shared/pagination.js';

export type ClinicalRecordListFilters = PaginationParams & {
    patientId?: string;
    tumorTypeId?: number;
    stage?: string;
    diagnosisFrom?: Date;
    diagnosisTo?: Date;
};

export type ClinicalRecordByPatientFilters = PaginationParams & {
    tumorTypeId?: number;
    stage?: string;
    diagnosisFrom?: Date;
    diagnosisTo?: Date;
};

export interface IClinicalRecordRepository {
    create(record: ClinicalRecord): Promise<void>;
    findAll(filters: ClinicalRecordListFilters): Promise<PaginatedResult<ClinicalRecord>>;
    findById(id: string): Promise<ClinicalRecord | null>;
    findByIdIncludingDeleted(id: string): Promise<{ record: ClinicalRecord; isDeleted: boolean } | null>;
    findByPatientId(patientId: string, filters: ClinicalRecordByPatientFilters): Promise<PaginatedResult<ClinicalRecord>>;
    update(record: ClinicalRecord): Promise<void>;
    delete(id: string): Promise<void>;
}
