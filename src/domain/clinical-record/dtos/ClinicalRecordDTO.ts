import { z } from 'zod';

export const CreateClinicalRecordSchema = z.object({
    patientId: z.string().uuid(),
    tumorTypeId: z.number().int().positive(),
    diagnosisDate: z.string().transform((str) => new Date(str)),
    stage: z.string().min(1),
    treatmentProtocol: z.string().min(1),
});

export const UpdateClinicalRecordSchema = CreateClinicalRecordSchema.partial();

export type CreateClinicalRecordDTO = z.infer<typeof CreateClinicalRecordSchema>;
export type UpdateClinicalRecordDTO = z.infer<typeof UpdateClinicalRecordSchema>;
