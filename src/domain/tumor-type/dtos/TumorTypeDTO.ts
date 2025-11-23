import { z } from 'zod';

export const CreateTumorTypeSchema = z.object({
    name: z.string().min(1),
    systemAffected: z.string().min(1),
});

export const UpdateTumorTypeSchema = CreateTumorTypeSchema.partial();

export type CreateTumorTypeDTO = z.infer<typeof CreateTumorTypeSchema>;
export type UpdateTumorTypeDTO = z.infer<typeof UpdateTumorTypeSchema>;
