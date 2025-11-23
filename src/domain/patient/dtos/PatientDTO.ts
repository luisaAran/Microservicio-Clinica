import { z } from 'zod';

export const PatientStatusSchema = z.enum(['Activo', 'Seguimiento', 'Inactivo']);
export const PatientGenderSchema = z.enum(['MASCULINO', 'FEMENINO', 'OTRO', 'NO_ESPECIFICADO']);

const DateOnlyStringSchema = z
    .string()
    .regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, 'La fecha debe tener el formato YYYY-MM-DD')
    .transform((str) => new Date(str));

export const CreatePatientSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    birthDate: DateOnlyStringSchema,
    gender: PatientGenderSchema,
});

export const UpdatePatientSchema = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    birthDate: DateOnlyStringSchema.optional(),
    gender: PatientGenderSchema.optional(),
    status: PatientStatusSchema.optional(),
});

export type CreatePatientDTO = z.infer<typeof CreatePatientSchema>;
export type UpdatePatientDTO = z.infer<typeof UpdatePatientSchema>;
export type PatientStatus = z.infer<typeof PatientStatusSchema>;
export type PatientGender = z.infer<typeof PatientGenderSchema>;
