import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Clinic Microservice API',
            version: '1.0.0',
            description: 'API documentation for the Clinic Microservice',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
        components: {
            schemas: {
                Patient: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        birthDate: { type: 'string', format: 'date-time' },
                        gender: { type: 'string' },
                        status: { type: 'string', enum: ['Activo', 'Seguimiento', 'Inactivo'] },
                    },
                },
                CreatePatient: {
                    type: 'object',
                    required: ['firstName', 'lastName', 'birthDate', 'gender'],
                    properties: {
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        birthDate: { type: 'string', format: 'date-time' },
                        gender: { type: 'string' },
                        status: { type: 'string', enum: ['Activo', 'Seguimiento', 'Inactivo'] },
                    },
                },
                UpdatePatient: {
                    type: 'object',
                    properties: {
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        birthDate: { type: 'string', format: 'date-time' },
                        gender: { type: 'string' },
                        status: { type: 'string', enum: ['Activo', 'Seguimiento', 'Inactivo'] },
                    },
                },
                TumorType: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        systemAffected: { type: 'string' },
                    },
                },
                CreateTumorType: {
                    type: 'object',
                    required: ['name', 'systemAffected'],
                    properties: {
                        name: { type: 'string' },
                        systemAffected: { type: 'string' },
                    },
                },
                UpdateTumorType: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        systemAffected: { type: 'string' },
                    },
                },
                ClinicalRecord: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        patientId: { type: 'string', format: 'uuid' },
                        tumorTypeId: { type: 'integer' },
                        diagnosisDate: { type: 'string', format: 'date-time' },
                        stage: { type: 'string' },
                        treatmentProtocol: { type: 'string' },
                    },
                },
                CreateClinicalRecord: {
                    type: 'object',
                    required: ['patientId', 'tumorTypeId', 'diagnosisDate', 'stage', 'treatmentProtocol'],
                    properties: {
                        patientId: { type: 'string', format: 'uuid' },
                        tumorTypeId: { type: 'integer' },
                        diagnosisDate: { type: 'string', format: 'date-time' },
                        stage: { type: 'string' },
                        treatmentProtocol: { type: 'string' },
                    },
                },
            },
        },
    },
    apis: ['./src/interface/http/routes/*.ts'],
};

export const specs = swaggerJsdoc(options);
