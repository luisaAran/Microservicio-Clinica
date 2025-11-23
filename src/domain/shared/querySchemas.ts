import { z } from 'zod';
import { PatientGenderSchema, PatientStatusSchema } from '../patient/dtos/PatientDTO.js';

const positiveInt = z.coerce.number().int().positive();

export const PaginationQuerySchema = z.object({
    page: positiveInt.default(1),
    limit: positiveInt.max(100).default(10),
});

const SearchSchema = z
    .string()
    .trim()
    .min(1, 'El parámetro de búsqueda debe contener al menos un carácter')
    .optional();

export const PatientListQuerySchema = PaginationQuerySchema.extend({
    search: SearchSchema,
    status: PatientStatusSchema.optional(),
    gender: PatientGenderSchema.optional(),
});

export type PatientListQuery = z.infer<typeof PatientListQuerySchema>;

export const TumorTypeListQuerySchema = PaginationQuerySchema.extend({
    search: SearchSchema,
    systemAffected: z
        .string()
        .trim()
        .min(1, 'El sistema afectado debe contener al menos un carácter')
        .optional(),
});

export type TumorTypeListQuery = z.infer<typeof TumorTypeListQuerySchema>;

const DiagnosisDateSchema = z
    .string()
    .trim()
    .regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)
    .transform((value) => new Date(value))
    .optional();

export const ClinicalRecordListQuerySchema = PaginationQuerySchema.extend({
    patientId: z.string().uuid().optional(),
    tumorTypeId: z.coerce.number().int().positive().optional(),
    stage: z.string().trim().min(1).optional(),
    diagnosisFrom: DiagnosisDateSchema,
    diagnosisTo: DiagnosisDateSchema,
});

export type ClinicalRecordListQuery = z.infer<typeof ClinicalRecordListQuerySchema>;

export const ClinicalRecordByPatientQuerySchema = PaginationQuerySchema.extend({
    tumorTypeId: z.coerce.number().int().positive().optional(),
    stage: z.string().trim().min(1).optional(),
    diagnosisFrom: DiagnosisDateSchema,
    diagnosisTo: DiagnosisDateSchema,
});

export type ClinicalRecordByPatientQuery = z.infer<typeof ClinicalRecordByPatientQuerySchema>;
