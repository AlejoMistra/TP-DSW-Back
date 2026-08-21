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
  email: z.email('Email invalido'),
  phone: z
    .string()
    .regex(/^\d{7,15}$/, 'Teléfono debe tener entre 7 y 15 dígitos')
    .nullable()
    .optional(),
});

export const UpdateInstructorSchema = CreateInstructorSchema.partial();

export const InstructorResponseSchema = CreateInstructorSchema.extend({
  id: z.number(),
});

export type CreateInstructorInput = z.infer<typeof CreateInstructorSchema>;
export type UpdateInstructorInput = z.infer<typeof UpdateInstructorSchema>;
export type InstructorResponse = z.infer<typeof InstructorResponseSchema>;
