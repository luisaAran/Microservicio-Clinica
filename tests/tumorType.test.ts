import request from 'supertest';
import app from '../src/app';
import { TumorType } from '../src/domain/tumor-type/entities/TumorType.js';
import type { TumorTypeListFilters } from '../src/domain/tumor-type/repositories/ITumorTypeRepository.js';

const mockTumorTypeRepository = {
    create: jest.fn(),
    update: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn(),
};

jest.mock('../src/domain/tumor-type/repositories/TumorTypeRepository.js', () => ({
    TumorTypeRepository: jest.fn(() => mockTumorTypeRepository),
}));

describe('TumorType API', () => {
    let tumorType: TumorType;

    beforeEach(() => {
        jest.clearAllMocks();
        tumorType = new TumorType(1, 'Carcinoma', 'Skin');
        mockTumorTypeRepository.findById.mockResolvedValue(tumorType);
        mockTumorTypeRepository.findAll.mockImplementation(async (filters: TumorTypeListFilters) => ({
            data: [tumorType],
            page: filters.page,
            limit: filters.limit,
            total: 1,
        }));
        mockTumorTypeRepository.create.mockResolvedValue(tumorType);
        mockTumorTypeRepository.update.mockResolvedValue(undefined);
        mockTumorTypeRepository.delete.mockResolvedValue(undefined);
    });

    it('creates a tumor type', async () => {
        const res = await request(app).post('/tumor-types').send({ name: 'Carcinoma', systemAffected: 'Skin' });
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Tipo de tumor creado exitosamente');
        expect(res.body.data).toMatchObject({ id: 1, name: 'Carcinoma', systemAffected: 'Skin' });
        expect(mockTumorTypeRepository.create).toHaveBeenCalledWith({ name: 'Carcinoma', systemAffected: 'Skin' });
    });

    it('lists tumor types with pagination metadata', async () => {
        const res = await request(app).get('/tumor-types').query({ page: 3, limit: 2, search: 'car' });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Tipos de tumor obtenidos exitosamente');
        expect(res.body.data).toHaveLength(1);
        expect(res.body.pagination).toMatchObject({ page: 3, limit: 2, total: 1, totalPages: 1 });
        expect(mockTumorTypeRepository.findAll).toHaveBeenCalledWith({ page: 3, limit: 2, search: 'car' });
    });

    it('validates list query parameters', async () => {
        const res = await request(app).get('/tumor-types').query({ limit: 150 });
        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({ error: 'Validation Error' });
    });

    it('returns a tumor type by id', async () => {
        const res = await request(app).get('/tumor-types/1');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Tipo de tumor obtenido exitosamente');
        expect(res.body.data).toMatchObject({ id: 1, name: 'Carcinoma' });
        expect(mockTumorTypeRepository.findById).toHaveBeenCalledWith(1);
    });

    it('responds 404 when tumor type does not exist', async () => {
        mockTumorTypeRepository.findById.mockResolvedValueOnce(null);
        const res = await request(app).get('/tumor-types/99');
        expect(res.status).toBe(404);
        expect(res.body).toMatchObject({ errorCode: 'NOT_FOUND' });
    });

    it('updates a tumor type', async () => {
        const res = await request(app).put('/tumor-types/1').send({ name: 'Sarcoma' });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Tipo de tumor actualizado exitosamente');
        expect(res.body.data.name).toBe('Sarcoma');
        expect(mockTumorTypeRepository.update).toHaveBeenCalledWith(expect.objectContaining({ name: 'Sarcoma' }));
    });

    it('deletes a tumor type', async () => {
        const res = await request(app).delete('/tumor-types/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Tipo de tumor eliminado exitosamente' });
        expect(mockTumorTypeRepository.delete).toHaveBeenCalledWith(1);
    });
});
