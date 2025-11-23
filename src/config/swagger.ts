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
                        id: { type: 'string', format: 'uuid', example: 'b9c2f9a6-8e6d-4c2d-9087-fbb2e2c1b2f0' },
                        firstName: { type: 'string', example: 'María Elena' },
                        lastName: { type: 'string', example: 'Fuentes Andrade' },
                        birthDate: { type: 'string', format: 'date', example: '1984-07-22' },
                        gender: {
                            type: 'string',
                            enum: ['MASCULINO', 'FEMENINO', 'OTRO', 'NO_ESPECIFICADO'],
                            example: 'FEMENINO',
                        },
                        status: { type: 'string', enum: ['Activo', 'Seguimiento', 'Inactivo'], example: 'Activo' },
                    },
                },
                CreatePatient: {
                    type: 'object',
                    required: ['firstName', 'lastName', 'birthDate', 'gender'],
                    properties: {
                        firstName: { type: 'string', example: 'Jorge Luis' },
                        lastName: { type: 'string', example: 'Cortés Ibáñez' },
                        birthDate: { type: 'string', format: 'date', example: '1992-03-11' },
                        gender: {
                            type: 'string',
                            enum: ['MASCULINO', 'FEMENINO', 'OTRO', 'NO_ESPECIFICADO'],
                            example: 'MASCULINO',
                        },
                    },
                },
                UpdatePatient: {
                    type: 'object',
                    properties: {
                        firstName: { type: 'string', example: 'Andrea Sofía' },
                        lastName: { type: 'string', example: 'Valdés Núñez' },
                        birthDate: { type: 'string', format: 'date', example: '1975-12-05' },
                        gender: {
                            type: 'string',
                            enum: ['MASCULINO', 'FEMENINO', 'OTRO', 'NO_ESPECIFICADO'],
                            example: 'OTRO',
                        },
                        status: { type: 'string', enum: ['Activo', 'Seguimiento', 'Inactivo'], example: 'Seguimiento' },
                    },
                },
                PatientResponse: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Paciente obtenido exitosamente' },
                        data: { $ref: '#/components/schemas/Patient' },
                    },
                },
                TumorType: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 12 },
                        name: { type: 'string', example: 'Carcinoma ductal infiltrante' },
                        systemAffected: { type: 'string', example: 'Mama' },
                    },
                },
                CreateTumorType: {
                    type: 'object',
                    required: ['name', 'systemAffected'],
                    properties: {
                        name: { type: 'string', example: 'Adenocarcinoma colorrectal' },
                        systemAffected: { type: 'string', example: 'Tracto gastrointestinal' },
                    },
                },
                UpdateTumorType: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', example: 'Glioblastoma multiforme' },
                        systemAffected: { type: 'string', example: 'Sistema nervioso central' },
                    },
                },
                TumorTypeResponse: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Tipo de tumor obtenido exitosamente' },
                        data: { $ref: '#/components/schemas/TumorType' },
                    },
                },
                ClinicalRecord: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid', example: '3d62bb64-9e1d-4330-9cf6-6a689312f606' },
                        patientId: { type: 'string', format: 'uuid', example: 'b9c2f9a6-8e6d-4c2d-9087-fbb2e2c1b2f0' },
                        tumorTypeId: { type: 'integer', example: 7 },
                        diagnosisDate: { type: 'string', format: 'date-time', example: '2024-05-14T00:00:00.000Z' },
                        stage: { type: 'string', example: 'IIIA' },
                        treatmentProtocol: {
                            type: 'string',
                            example: 'Quimioterapia FEC cada 21 días + radioterapia adyuvante',
                        },
                    },
                },
                CreateClinicalRecord: {
                    type: 'object',
                    required: ['patientId', 'tumorTypeId', 'diagnosisDate', 'stage', 'treatmentProtocol'],
                    properties: {
                        patientId: { type: 'string', format: 'uuid', example: 'b9c2f9a6-8e6d-4c2d-9087-fbb2e2c1b2f0' },
                        tumorTypeId: { type: 'integer', example: 7 },
                        diagnosisDate: { type: 'string', format: 'date-time', example: '2024-05-14T00:00:00.000Z' },
                        stage: { type: 'string', example: 'IIB' },
                        treatmentProtocol: {
                            type: 'string',
                            example: 'Cirugía conservadora + quimioterapia AC-T',
                        },
                    },
                },
                UpdateClinicalRecord: {
                    type: 'object',
                    properties: {
                        patientId: { type: 'string', format: 'uuid', example: 'b9c2f9a6-8e6d-4c2d-9087-fbb2e2c1b2f0' },
                        tumorTypeId: { type: 'integer', example: 9 },
                        diagnosisDate: { type: 'string', format: 'date-time', example: '2024-06-01T00:00:00.000Z' },
                        stage: { type: 'string', example: 'IV' },
                        treatmentProtocol: {
                            type: 'string',
                            example: 'Terapia dirigida con trastuzumab + palbociclib',
                        },
                    },
                },
                ClinicalRecordResponse: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Historia clínica obtenida exitosamente' },
                        data: { $ref: '#/components/schemas/ClinicalRecord' },
                    },
                },
                PaginationMeta: {
                    type: 'object',
                    properties: {
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 10 },
                        total: { type: 'integer', example: 47 },
                        totalPages: { type: 'integer', example: 5 },
                    },
                },
                MessageResponse: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Operación realizada exitosamente' },
                    },
                },
                PaginatedPatients: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Pacientes obtenidos exitosamente' },
                        data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Patient' },
                        },
                        pagination: { $ref: '#/components/schemas/PaginationMeta' },
                    },
                },
                PaginatedTumorTypes: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Tipos de tumor obtenidos exitosamente' },
                        data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/TumorType' },
                        },
                        pagination: { $ref: '#/components/schemas/PaginationMeta' },
                    },
                },
                PaginatedClinicalRecords: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Historias clínicas obtenidas exitosamente' },
                        data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/ClinicalRecord' },
                        },
                        pagination: { $ref: '#/components/schemas/PaginationMeta' },
                    },
                },
            },
        },
    },
    apis: ['./src/interface/http/routes/*.ts'],
};

export const specs = swaggerJsdoc(options);
