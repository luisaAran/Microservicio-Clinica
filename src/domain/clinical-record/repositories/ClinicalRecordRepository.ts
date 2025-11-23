import { eq } from 'drizzle-orm';
import { db } from '../../../infrastructure/database/drizzle/db';
import { clinicalRecords } from '../../../infrastructure/database/drizzle/schema';
import { ClinicalRecord } from '../entities/ClinicalRecord';
import { IClinicalRecordRepository } from './IClinicalRecordRepository';

export class ClinicalRecordRepository implements IClinicalRecordRepository {
    async create(record: ClinicalRecord): Promise<void> {
        await db.insert(clinicalRecords).values({
            id: record.id,
            patientId: record.patientId,
            tumorTypeId: record.tumorTypeId,
            diagnosisDate: record.diagnosisDate,
            stage: record.stage,
            treatmentProtocol: record.treatmentProtocol,
        });
    }

    async findByPatientId(patientId: string): Promise<ClinicalRecord[]> {
        const result = await db
            .select()
            .from(clinicalRecords)
            .where(eq(clinicalRecords.patientId, patientId));
        return result.map(
            (row) =>
                new ClinicalRecord(
                    row.id,
                    row.patientId,
                    row.tumorTypeId,
                    row.diagnosisDate,
                    row.stage,
                    row.treatmentProtocol
                )
        );
    }
}
