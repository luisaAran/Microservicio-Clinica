import { v4 as uuidv4 } from 'uuid';
import { IPatientRepository } from '../repositories/IPatientRepository.js';
import { CreatePatientDTO, UpdatePatientDTO } from '../dtos/PatientDTO.js';
import { Patient } from '../entities/Patient.js';
import { EventPublisher } from '../../../infrastructure/messaging/EventPublisher.js';
import { PatientAlreadyDeletedError as PatientAlreadyDisabledError, PatientNotFoundError } from '../errors/PatientErrors.js';
import type { PaginatedResult } from '../../shared/pagination.js';
import type { PatientListFilters } from '../repositories/IPatientRepository.js';

export class PatientService {
    constructor(private patientRepository: IPatientRepository) { }
    async createPatient(dto: CreatePatientDTO): Promise<Patient> {
        const patient = new Patient(
            uuidv4(),
            dto.firstName,
            dto.lastName,
            dto.birthDate,
            dto.gender,
            'Activo'
        );
        await this.patientRepository.create(patient);
        await EventPublisher.getInstance().publish('PatientCreated', patient);
        return patient;
    }
    async updatePatient(id: string, dto: UpdatePatientDTO): Promise<Patient> {
        const patient = await this.getPatientById(id);
        if (dto.firstName) patient.firstName = dto.firstName;
        if (dto.lastName) patient.lastName = dto.lastName;
        if (dto.birthDate) patient.birthDate = dto.birthDate;
        if (dto.gender) patient.gender = dto.gender;
        if (dto.status) patient.status = dto.status;
        await this.patientRepository.update(patient);
        await EventPublisher.getInstance().publish('PatientUpdated', patient);
        return patient;
    }
    async getPatientById(id: string): Promise<Patient> {
        const patient = await this.patientRepository.findById(id);
        if (!patient) {
            throw new PatientNotFoundError(id);
        }
        return patient;
    }

    async listPatients(filters: PatientListFilters): Promise<PaginatedResult<Patient>> {
        return this.patientRepository.findAll(filters);
    }

    async disablePatient(id: string): Promise<void> {
        const patientToDelte = await this.getPatientById(id);
        if(patientToDelte.status === "Inactivo") throw new PatientAlreadyDisabledError(id);
        await this.patientRepository.delete(id);
    }
}
