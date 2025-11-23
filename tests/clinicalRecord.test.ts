import request from 'supertest';
import app from '../src/app';
import { ClinicalRecord } from '../src/domain/clinical-record/entities/ClinicalRecord.js';
import { Patient } from '../src/domain/patient/entities/Patient.js';
import { TumorType } from '../src/domain/tumor-type/entities/TumorType.js';
import type { ClinicalRecordByPatientFilters, ClinicalRecordListFilters } from '../src/domain/clinical-record/repositories/IClinicalRecordRepository.js';

const mockClinicalRecordRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByPatientId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

const mockPatientRepository = {
    create: jest.fn(),
    update: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn(),
};

const mockTumorTypeRepository = {
    create: jest.fn(),
    update: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn(),
};

const publishMock = jest.fn();

jest.mock('../src/domain/clinical-record/repositories/ClinicalRecordRepository.js', () => ({
    ClinicalRecordRepository: jest.fn(() => mockClinicalRecordRepository),
}));

jest.mock('../src/domain/patient/repositories/PatientRepository.js', () => ({
    PatientRepository: jest.fn(() => mockPatientRepository),
}));

jest.mock('../src/domain/tumor-type/repositories/TumorTypeRepository.js', () => ({
    TumorTypeRepository: jest.fn(() => mockTumorTypeRepository),
}));

jest.mock('../src/infrastructure/messaging/EventPublisher.js', () => ({
    EventPublisher: {
        getInstance: () => ({ publish: publishMock }),
    },
}));

describe('ClinicalRecord API', () => {
    let patient: Patient;
    let tumorType: TumorType;
    let record: ClinicalRecord;

    beforeEach(() => {
        jest.clearAllMocks();
        patient = new Patient(
            'd290f1ee-6c54-4b01-90e6-d701748f0851',
            'Jane',
            'Doe',
            new Date('1990-01-01'),
            'FEMENINO',
            'Activo'
        );
        tumorType = new TumorType(1, 'Carcinoma', 'Skin');
        record = new ClinicalRecord(
            '3d594650-3436-4f5a-8c4a-4d3b8f8a8c3f',
            patient.id,
            tumorType.id,
            new Date('2023-01-01'),
            'I',
            'Chemo'
        );
        mockPatientRepository.findById.mockResolvedValue(patient);
        mockTumorTypeRepository.findById.mockResolvedValue(tumorType);
        mockClinicalRecordRepository.findById.mockResolvedValue(record);
        mockClinicalRecordRepository.findAll.mockImplementation(async (filters: ClinicalRecordListFilters) => ({
            data: [record],
            page: filters.page,
            limit: filters.limit,
            total: 1,
        }));
        mockClinicalRecordRepository.findByPatientId.mockImplementation(
            async (patientId: string, filters: ClinicalRecordByPatientFilters) => {
                void patientId;
                return {
                    data: [record],
                    page: filters.page,
                    limit: filters.limit,
                    total: 1,
                };
            }
        );
        mockClinicalRecordRepository.create.mockResolvedValue(undefined);
        mockClinicalRecordRepository.update.mockResolvedValue(undefined);
        mockClinicalRecordRepository.delete.mockResolvedValue(undefined);
        publishMock.mockResolvedValue(undefined);
    });

    it('creates a clinical record validating references', async () => {
        const res = await request(app).post('/clinical-records').send({
            patientId: patient.id,
            tumorTypeId: tumorType.id,
            diagnosisDate: '2023-02-01',
            stage: 'II',
            treatmentProtocol: 'Radiation',
        });
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Historia clínica creada exitosamente');
        expect(res.body.data).toMatchObject({ patientId: patient.id, tumorTypeId: tumorType.id, stage: 'II' });
        expect(mockPatientRepository.findById).toHaveBeenCalledWith(patient.id);
        expect(mockTumorTypeRepository.findById).toHaveBeenCalledWith(tumorType.id);
        expect(mockClinicalRecordRepository.create).toHaveBeenCalledTimes(1);
        expect(publishMock).toHaveBeenCalledWith('ClinicalRecordCreated', expect.objectContaining({ stage: 'II' }));
    });

    it('lists clinical records with pagination and filters', async () => {
        const res = await request(app).get('/clinical-records').query({ page: 2, limit: 3, stage: 'I' });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Historias clínicas obtenidas exitosamente');
        expect(res.body.data).toHaveLength(1);
        expect(res.body.pagination).toMatchObject({ page: 2, limit: 3, total: 1, totalPages: 1 });
        expect(mockClinicalRecordRepository.findAll).toHaveBeenCalledWith({ page: 2, limit: 3, stage: 'I' });
    });

    it('validates list query parameters', async () => {
        const res = await request(app).get('/clinical-records').query({ page: 0 });
        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({ error: 'Validation Error' });
    });

    it('retrieves a clinical record by id', async () => {
        const res = await request(app).get(`/clinical-records/${record.id}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Historia clínica obtenida exitosamente');
        expect(res.body.data).toMatchObject({ id: record.id, stage: 'I' });
    });

    it('returns 404 when clinical record is missing', async () => {
        mockClinicalRecordRepository.findById.mockResolvedValueOnce(null);
        const res = await request(app).get(`/clinical-records/${record.id}`);
        expect(res.status).toBe(404);
        expect(res.body).toMatchObject({ errorCode: 'NOT_FOUND' });
    });

    it('lists records by patient id', async () => {
        const res = await request(app)
            .get(`/patients/${patient.id}/clinical-records`)
            .query({ page: 1, limit: 2, stage: 'I' });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Historias clínicas del paciente obtenidas exitosamente');
        expect(res.body.pagination).toMatchObject({ page: 1, limit: 2, total: 1, totalPages: 1 });
        expect(mockClinicalRecordRepository.findByPatientId).toHaveBeenCalledWith(patient.id, {
            page: 1,
            limit: 2,
            stage: 'I',
        });
    });

    it('updates a clinical record', async () => {
        const res = await request(app)
            .put(`/clinical-records/${record.id}`)
            .send({ stage: 'III', treatmentProtocol: 'Combined' });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Historia clínica actualizada exitosamente');
        expect(res.body.data.stage).toBe('III');
        expect(mockClinicalRecordRepository.update).toHaveBeenCalledWith(
            expect.objectContaining({ id: record.id, stage: 'III', treatmentProtocol: 'Combined' })
        );
        expect(publishMock).toHaveBeenCalledWith('ClinicalRecordUpdated', expect.objectContaining({ id: record.id }));
    });

    it('deletes a clinical record', async () => {
        const res = await request(app).delete(`/clinical-records/${record.id}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Historia clínica eliminada exitosamente' });
        expect(mockClinicalRecordRepository.delete).toHaveBeenCalledWith(record.id);
        expect(publishMock).toHaveBeenLastCalledWith('ClinicalRecordDeleted', { id: record.id });
    });
});
