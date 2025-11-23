import request from 'supertest';
import app from '../src/app';

describe('TumorType API', () => {
    it('should create a new tumor type', async () => {
        const res = await request(app)
            .post('/tumor-types')
            .send({
                name: 'Carcinoma',
                systemAffected: 'Skin',
            });

        if (res.status === 201) {
            expect(res.body).toHaveProperty('id');
            expect(res.body.name).toBe('Carcinoma');
        } else {
            expect([200, 201]).toContain(res.status);
        }
    });
});
