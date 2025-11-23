import { and, eq, like, sql, type SQL } from 'drizzle-orm';
import { db } from '../../../infrastructure/database/drizzle/db';
import { tumorTypes } from '../../../infrastructure/database/drizzle/schema';
import { TumorType } from '../entities/TumorType';
import { type TumorTypeListFilters, ITumorTypeRepository } from './ITumorTypeRepository.js';
import { createPaginatedResult } from '../../shared/pagination.js';
import type { PaginatedResult } from '../../shared/pagination.js';

type TumorTypeRow = typeof tumorTypes.$inferSelect;

const mapRowToEntity = (row: TumorTypeRow): TumorType => new TumorType(row.id, row.name, row.systemAffected);

export class TumorTypeRepository implements ITumorTypeRepository {
    async create(tumorType: Omit<TumorType, 'id'>): Promise<TumorType> {
        const [result] = await db.insert(tumorTypes).values({
            name: tumorType.name,
            systemAffected: tumorType.systemAffected,
        });
        return new TumorType(result.insertId, tumorType.name, tumorType.systemAffected);
    }
    async update(tumorType: TumorType): Promise<void> {
        await db
            .update(tumorTypes)
            .set({
                name: tumorType.name,
                systemAffected: tumorType.systemAffected,
            })
            .where(eq(tumorTypes.id, tumorType.id));
    }
    async findById(id: number): Promise<TumorType | null> {
        const result = await db
            .select()
            .from(tumorTypes)
            .where(and(eq(tumorTypes.id, id), eq(tumorTypes.isDeleted, false)))
            .limit(1);
        const row = result[0];
        return row ? mapRowToEntity(row) : null;
    }
    async findByIdIncludingDeleted(id: number): Promise<{ tumorType: TumorType; isDeleted: boolean } | null> {
        const result = await db.select().from(tumorTypes).where(eq(tumorTypes.id, id)).limit(1);
        const row = result[0];
        return row ? { tumorType: mapRowToEntity(row), isDeleted: !!row.isDeleted } : null;
    }
    async findAll(filters: TumorTypeListFilters): Promise<PaginatedResult<TumorType>> {
        const { page, limit, search, systemAffected } = filters;
        const offset = (page - 1) * limit;
        const conditions: SQL[] = [eq(tumorTypes.isDeleted, false)];
        if (systemAffected) {
            conditions.push(like(tumorTypes.systemAffected, systemAffected));
        }
        if (search) {
            const pattern = `%${search}%`;
            const searchCondition = like(tumorTypes.name, pattern);
            if (searchCondition) {
                conditions.push(searchCondition);
            }
        }
        const whereClause = conditions.length ? and(...conditions) : undefined;
        const totalQuery = db.select({ total: sql<number>`count(*)` }).from(tumorTypes);
        const totalResult = whereClause ? totalQuery.where(whereClause) : totalQuery;
        const [{ total }] = await totalResult;
        const baseListQuery = db.select().from(tumorTypes);
        const filteredListQuery = whereClause ? baseListQuery.where(whereClause) : baseListQuery;
        const result = await filteredListQuery.orderBy(tumorTypes.name).limit(limit).offset(offset);
        const tumorTypeList = result.map(mapRowToEntity);
        return createPaginatedResult(tumorTypeList, { page, limit }, total);
    }

    async delete(id: number): Promise<void> {
        await db
            .update(tumorTypes)
            .set({ isDeleted: true })
            .where(eq(tumorTypes.id, id));
    }
}
