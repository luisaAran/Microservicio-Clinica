import { Patient } from '../entities/Patient';

export interface IPatientRepository {
    create(patient: Patient): Promise<void>;
    update(patient: Patient): Promise<void>;
    findById(id: string): Promise<Patient | null>;
    delete(id: string): Promise<void>; // Soft delete or status change
}
