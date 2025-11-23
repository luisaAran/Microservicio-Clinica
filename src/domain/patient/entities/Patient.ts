import type { PatientGender, PatientStatus } from '../dtos/PatientDTO.js';

export class Patient {
    constructor(
        public readonly id: string,
        public firstName: string,
        public lastName: string,
        public birthDate: Date,
        public gender: PatientGender,
        public status: PatientStatus
    ) { }
}
