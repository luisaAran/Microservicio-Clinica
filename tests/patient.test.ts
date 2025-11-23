import request from 'supertest';
import app from '../src/app';
import { Patient } from '../src/domain/patient/entities/Patient.js';
import type { PatientListFilters } from '../src/domain/patient/repositories/IPatientRepository.js';

const mockPatientRepository = {
    create: jest.fn(),
    update: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn(),
};

const publishMock = jest.fn();

jest.mock('../src/domain/patient/repositories/PatientRepository.js', () => ({
    PatientRepository: jest.fn(() => mockPatientRepository),
}));

jest.mock('../src/infrastructure/messaging/EventPublisher.js', () => ({
    EventPublisher: {
        getInstance: () => ({ publish: publishMock }),
    },
}));

describe('Patient API', () => {
    let existingPatient: Patient;

    beforeEach(() => {
        jest.clearAllMocks();
        existingPatient = new Patient(
            'd290f1ee-6c54-4b01-90e6-d701748f0851',
            'Jane',
            'Doe',
            new Date('1990-01-01'),
            'FEMENINO',
            'Activo'
        );
        mockPatientRepository.findById.mockResolvedValue(existingPatient);
        mockPatientRepository.findAll.mockImplementation(async (filters: PatientListFilters) => ({
            data: [existingPatient],
            page: filters.page,
            limit: filters.limit,
            total: 1,
        }));
        mockPatientRepository.create.mockResolvedValue(undefined);
        mockPatientRepository.update.mockResolvedValue(undefined);
        mockPatientRepository.delete.mockResolvedValue(undefined);
        publishMock.mockResolvedValue(undefined);
    });

    it('creates a new patient', async () => {
        const res = await request(app).post('/patients').send({
            firstName: 'John',
            lastName: 'Doe',
            birthDate: '1990-01-01',
            gender: 'MASCULINO',
        });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Paciente creado exitosamente');
        expect(res.body.data).toMatchObject({
            firstName: 'John',
            lastName: 'Doe',
            gender: 'MASCULINO',
            status: 'Activo',
        });
        expect(res.body.data.id).toMatch(/[0-9a-fA-F-]{36}/);
        expect(mockPatientRepository.create).toHaveBeenCalledTimes(1);
        expect(publishMock).toHaveBeenCalledWith('PatientCreated', expect.objectContaining({ firstName: 'John' }));
    });

    it('returns paginated patients with filters', async () => {
        const res = await request(app).get('/patients').query({ page: 2, limit: 5, status: 'Activo' });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Pacientes obtenidos exitosamente');
        expect(res.body.data).toHaveLength(1);
        expect(res.body.pagination).toMatchObject({ page: 2, limit: 5, total: 1, totalPages: 1 });
        expect(mockPatientRepository.findAll).toHaveBeenCalledWith({ page: 2, limit: 5, status: 'Activo' });
    });

    it('rejects invalid pagination query params', async () => {
        const res = await request(app).get('/patients').query({ page: 0 });
        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({ error: 'Validation Error' });
    });

    it('retrieves a patient by id', async () => {
        const res = await request(app).get(`/patients/${existingPatient.id}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Paciente obtenido exitosamente');
        expect(res.body.data).toMatchObject({ id: existingPatient.id, firstName: 'Jane' });
        expect(mockPatientRepository.findById).toHaveBeenCalledWith(existingPatient.id);
    });

    it('returns 404 when patient does not exist', async () => {
        mockPatientRepository.findById.mockResolvedValueOnce(null);
        const res = await request(app).get(`/patients/${existingPatient.id}`);
        expect(res.status).toBe(404);
        expect(res.body).toMatchObject({ errorCode: 'NOT_FOUND' });
    });

    it('updates a patient', async () => {
        const res = await request(app)
            .put(`/patients/${existingPatient.id}`)
            .send({ status: 'Seguimiento' });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Paciente actualizado exitosamente');
        expect(res.body.data.status).toBe('Seguimiento');
        expect(mockPatientRepository.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'Seguimiento' }));
        expect(publishMock).toHaveBeenCalledWith('PatientUpdated', expect.objectContaining({ id: existingPatient.id }));
    });

    it('disables a patient', async () => {
        const res = await request(app).delete(`/patients/${existingPatient.id}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Paciente deshabilitado exitosamente' });
        expect(mockPatientRepository.delete).toHaveBeenCalledWith(existingPatient.id);
    });
});
