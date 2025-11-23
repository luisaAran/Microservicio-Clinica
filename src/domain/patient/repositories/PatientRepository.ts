import { and, eq, inArray, like, or, sql, type SQL } from 'drizzle-orm';
import { db } from '../../../infrastructure/database/drizzle/db';
import { patients } from '../../../infrastructure/database/drizzle/schema';
import { Patient } from '../entities/Patient';
import type { PatientGender, PatientStatus } from '../dtos/PatientDTO.js';
import { type PatientListFilters, IPatientRepository } from './IPatientRepository.js';
import { createPaginatedResult } from '../../shared/pagination.js';
import type { PaginatedResult } from '../../shared/pagination.js';

export class PatientRepository implements IPatientRepository {
    async create(patient: Patient): Promise<void> {
        await db.insert(patients).values({
            id: patient.id,
            firstName: patient.firstName,
            lastName: patient.lastName,
            birthDate: patient.birthDate,
            gender: patient.gender,
            status: patient.status,
        });
    }

    async update(patient: Patient): Promise<void> {
        await db
            .update(patients)
            .set({
                firstName: patient.firstName,
                lastName: patient.lastName,
                birthDate: patient.birthDate,
                gender: patient.gender,
                status: patient.status,
            })
            .where(eq(patients.id, patient.id));
    }

    async findById(id: string): Promise<Patient | null> {
        const result = await db.select().from(patients).where(eq(patients.id, id));
        if (result.length === 0) return null;
        const row = result[0];
        return new Patient(
            row.id,
            row.firstName,
            row.lastName,
            row.birthDate,
            row.gender as PatientGender,
            row.status as PatientStatus
        );
    }

    async findAll(filters: PatientListFilters): Promise<PaginatedResult<Patient>> {
        const { page, limit, search, status, gender } = filters;
        const offset = (page - 1) * limit;
        const conditions: SQL[] = [];
        if (status) {
            conditions.push(eq(patients.status, status));
        } else {
            conditions.push(inArray(patients.status, ['Activo', 'Seguimiento']));
        }
        if (gender) {
            conditions.push(eq(patients.gender, gender));
        }
        if (search) {
            const pattern = `%${search}%`;
            const searchCondition = or(like(patients.firstName, pattern), like(patients.lastName, pattern));
            if (searchCondition) {
                conditions.push(searchCondition);
            }
        }
        const whereClause = conditions.length ? and(...conditions) : undefined;
        const totalQuery = db.select({ total: sql<number>`count(*)` }).from(patients);
        const totalResult = whereClause ? totalQuery.where(whereClause) : totalQuery;
        const [{ total }] = await totalResult;
        const baseListQuery = db.select().from(patients);
        const filteredListQuery = whereClause ? baseListQuery.where(whereClause) : baseListQuery;
        const result = await filteredListQuery
            .orderBy(patients.lastName, patients.firstName)
            .limit(limit)
            .offset(offset);
        const patientList = result.map(
            (row) =>
                new Patient(
                    row.id,
                    row.firstName,
                    row.lastName,
                    row.birthDate,
                    row.gender as PatientGender,
                    row.status as PatientStatus
                )
        );
        return createPaginatedResult(patientList, { page, limit }, total);
    }
    async delete(id: string): Promise<void> {
        await db
            .update(patients)
            .set({ status: 'Inactivo' })
            .where(eq(patients.id, id));
    }
}
