import { z } from 'zod';

export const PatientIdParamSchema = z.object({
    id: z.uuid('El identificador del paciente debe ser un UUID válido'),
}).transform(({ id }) => ({ patientId: id }));

export type PatientIdParams = z.infer<typeof PatientIdParamSchema>;

export const TumorTypeIdParamSchema = z.object({
    id: z.coerce.number().int('El identificador de tumor debe ser un entero').positive('El identificador de tumor debe ser positivo'),
}).transform(({ id }) => ({ tumorTypeId: id }));

export type TumorTypeIdParams = z.infer<typeof TumorTypeIdParamSchema>;

export const ClinicalRecordIdParamSchema = z.object({
    id: z.string().uuid('El identificador de la historia clínica debe ser un UUID válido'),
}).transform(({ id }) => ({ clinicalRecordId: id }));

export type ClinicalRecordIdParams = z.infer<typeof ClinicalRecordIdParamSchema>;
