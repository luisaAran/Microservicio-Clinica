import request from 'supertest';
import app from '../src/app';
import { v4 as uuidv4 } from 'uuid';

describe('ClinicalRecord API', () => {
    it('should create a new clinical record', async () => {
        const res = await request(app)
            .post('/clinical-records')
            .send({
                patientId: uuidv4(), // Random UUID, will fail FK constraint if DB is real and patient doesn't exist
                tumorTypeId: 1,
                diagnosisDate: '2023-01-01',
                stage: 'I',
                treatmentProtocol: 'Chemo',
            });

        if (res.status === 201) {
            expect(res.body).toHaveProperty('id');
        } else {
            // 500 for DB error or 400 for validation/FK error
            expect([200, 201]).toContain(res.status);
        }
    });
});
