import { eq } from 'drizzle-orm';
import { db } from '../../../infrastructure/database/drizzle/db';
import { tumorTypes } from '../../../infrastructure/database/drizzle/schema';
import { TumorType } from '../entities/TumorType';
import { ITumorTypeRepository } from './ITumorTypeRepository';

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
        const result = await db.select().from(tumorTypes).where(eq(tumorTypes.id, id));
        const row = result[0];
        if (!row) return null;
        return new TumorType(row.id, row.name, row.systemAffected);
    }
    async findAll(): Promise<TumorType[]> {
        const result = await db.select().from(tumorTypes);
        return result.map(
            (row:TumorType) => new TumorType(row.id, row.name, row.systemAffected)
        );
    }
}
