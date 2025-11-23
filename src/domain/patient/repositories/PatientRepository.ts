import { eq } from 'drizzle-orm';
import { db } from '../../../infrastructure/database/drizzle/db';
import { patients } from '../../../infrastructure/database/drizzle/schema';
import { Patient } from '../entities/Patient';
import { IPatientRepository } from './IPatientRepository';

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
            row.gender,
            row.status as 'Activo' | 'Seguimiento' | 'Inactivo'
        );
    }

    async delete(id: string): Promise<void> {
        // Soft delete by changing status to 'Inactivo'
        await db
            .update(patients)
            .set({ status: 'Inactivo' })
            .where(eq(patients.id, id));
    }
}
