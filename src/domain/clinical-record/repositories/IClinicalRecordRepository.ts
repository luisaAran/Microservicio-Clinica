import { ClinicalRecord } from '../entities/ClinicalRecord';

export interface IClinicalRecordRepository {
    create(record: ClinicalRecord): Promise<void>;
    findByPatientId(patientId: string): Promise<ClinicalRecord[]>;
}
