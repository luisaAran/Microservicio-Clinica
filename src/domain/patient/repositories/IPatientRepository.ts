import { Patient } from '../entities/Patient.js';
import type { PatientGender, PatientStatus } from '../dtos/PatientDTO.js';
import type { PaginatedResult, PaginationParams } from '../../shared/pagination.js';

export type PatientListFilters = PaginationParams & {
    search?: string;
    status?: PatientStatus;
    gender?: PatientGender;
};

export interface IPatientRepository {
    create(patient: Patient): Promise<void>;
    update(patient: Patient): Promise<void>;
    findById(id: string): Promise<Patient | null>;
    findAll(filters: PatientListFilters): Promise<PaginatedResult<Patient>>;
    delete(id: string): Promise<void>; 
}
