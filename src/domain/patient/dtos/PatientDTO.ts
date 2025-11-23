import { z } from 'zod';

export const CreatePatientSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    birthDate: z.string().transform((str) => new Date(str)),
    gender: z.string(),
    status: z.enum(['Activo', 'Seguimiento', 'Inactivo']).default('Activo'),
});

export const UpdatePatientSchema = CreatePatientSchema.partial();

export type CreatePatientDTO = z.infer<typeof CreatePatientSchema>;
export type UpdatePatientDTO = z.infer<typeof UpdatePatientSchema>;
