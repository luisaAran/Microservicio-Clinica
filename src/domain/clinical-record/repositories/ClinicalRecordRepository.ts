import { and, eq, gte, like, lte, sql, type SQL } from 'drizzle-orm';
import { db } from '../../../infrastructure/database/drizzle/db';
import { clinicalRecords } from '../../../infrastructure/database/drizzle/schema';
import { ClinicalRecord } from '../entities/ClinicalRecord';
import {
    type ClinicalRecordByPatientFilters,
    type ClinicalRecordListFilters,
    IClinicalRecordRepository,
} from './IClinicalRecordRepository.js';
import { createPaginatedResult } from '../../shared/pagination.js';
import type { PaginatedResult } from '../../shared/pagination.js';

type ClinicalRecordRow = typeof clinicalRecords.$inferSelect;

const mapRowToEntity = (row: ClinicalRecordRow): ClinicalRecord =>
    new ClinicalRecord(row.id, row.patientId, row.tumorTypeId, row.diagnosisDate, row.stage, row.treatmentProtocol);

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

    async findById(id: string): Promise<ClinicalRecord | null> {
        const result = await db
            .select()
            .from(clinicalRecords)
            .where(and(eq(clinicalRecords.id, id), eq(clinicalRecords.isDeleted, false)))
            .limit(1);
        const row = result[0];
        return row ? mapRowToEntity(row) : null;
    }

    async findByIdIncludingDeleted(id: string): Promise<{ record: ClinicalRecord; isDeleted: boolean } | null> {
        const result = await db.select().from(clinicalRecords).where(eq(clinicalRecords.id, id)).limit(1);
        const row = result[0];
        return row ? { record: mapRowToEntity(row), isDeleted: !!row.isDeleted } : null;
    }

    async findAll(filters: ClinicalRecordListFilters): Promise<PaginatedResult<ClinicalRecord>> {
        return this.fetchWithFilters(filters, filters);
    }
    async update(record: ClinicalRecord): Promise<void> {
        await db
            .update(clinicalRecords)
            .set({
                patientId: record.patientId,
                tumorTypeId: record.tumorTypeId,
                diagnosisDate: record.diagnosisDate,
                stage: record.stage,
                treatmentProtocol: record.treatmentProtocol,
            })
            .where(eq(clinicalRecords.id, record.id));
    }
    async delete(id: string): Promise<void> {
        await db
            .update(clinicalRecords)
            .set({ isDeleted: true })
            .where(eq(clinicalRecords.id, id));
    }
    async findByPatientId(
        patientId: string,
        filters: ClinicalRecordByPatientFilters
    ): Promise<PaginatedResult<ClinicalRecord>> {
        return this.fetchWithFilters({ ...filters, patientId }, filters);
    }

    private buildConditions(filters: ClinicalRecordListFilters | (ClinicalRecordByPatientFilters & { patientId?: string })) {
        const conditions: SQL[] = [eq(clinicalRecords.isDeleted, false)];
        if (filters.patientId) {
            conditions.push(eq(clinicalRecords.patientId, filters.patientId));
        }
        if (filters.tumorTypeId) {
            conditions.push(eq(clinicalRecords.tumorTypeId, filters.tumorTypeId));
        }
        if (filters.stage) {
            conditions.push(like(clinicalRecords.stage, filters.stage));
        }
        if (filters.diagnosisFrom) {
            conditions.push(gte(clinicalRecords.diagnosisDate, filters.diagnosisFrom));
        }
        if (filters.diagnosisTo) {
            conditions.push(lte(clinicalRecords.diagnosisDate, filters.diagnosisTo));
        }
        return conditions;
    }

    private async fetchWithFilters(
        filters: ClinicalRecordListFilters | (ClinicalRecordByPatientFilters & { patientId?: string }),
        pagination: { page: number; limit: number }
    ): Promise<PaginatedResult<ClinicalRecord>> {
        const { page, limit } = pagination;
        const offset = (page - 1) * limit;
        const conditions = this.buildConditions(filters);
        const whereClause = conditions.length ? and(...conditions) : undefined;
        const totalQuery = db.select({ total: sql<number>`count(*)` }).from(clinicalRecords);
        const totalResult = whereClause ? totalQuery.where(whereClause) : totalQuery;
        const [{ total }] = await totalResult;
        const baseListQuery = db.select().from(clinicalRecords);
        const filteredListQuery = whereClause ? baseListQuery.where(whereClause) : baseListQuery;
        const rows = await filteredListQuery
            .orderBy(clinicalRecords.diagnosisDate)
            .limit(limit)
            .offset(offset);
        return createPaginatedResult(rows.map(mapRowToEntity), { page, limit }, total);
    }
}
