import { z } from 'zod';

export const InstructorIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID debe ser un número').transform(Number),
});

export const CreateInstructorSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').max(100),
  surname: z
    .string()
    .min(2, 'Apellido debe tener al menos 2 caracteres')
    .max(100),
  email: z.string().email('Email invalido'),
});

export const UpdateInstructorSchema = CreateInstructorSchema.partial();

export const InstructorResponseSchema = CreateInstructorSchema.extend({
  id: z.number(),
});

export type CreateInstructorInput = z.infer<typeof CreateInstructorSchema>;
export type UpdateInstructorInput = z.infer<typeof UpdateInstructorSchema>;
export type InstructorResponse = z.infer<typeof InstructorResponseSchema>;
