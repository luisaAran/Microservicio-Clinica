import request from 'supertest';
import app from '../src/app';

describe('Patient API', () => {
    it('should create a new patient', async () => {
        const res = await request(app)
            .post('/patients')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                birthDate: '1990-01-01',
                gender: 'Male',
                status: 'Activo',
            });

        // Note: This will fail if DB is not running. 
        // In a real scenario, we would mock the repository or use a test DB.
        // For now, we expect 500 or 201 depending on DB state.
        // If we want to just verify the code structure, we can mock.
        // But user asked for supertest, implying integration.

        if (res.status === 201) {
            expect(res.body).toHaveProperty('id');
            expect(res.body.firstName).toBe('John');
        } else {
            // Assuming DB connection failure
            expect([200, 201]).toContain(res.status);
        }
    });
});
