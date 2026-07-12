import { z } from 'zod';

const categories = ['yoga', 'spinning', 'crossfit', 'pilates'] as const;

export const ClassIdSchema = z.object({
  id: z.coerce.number().int().positive('ID debe ser un numero mayor que 0'),
});

export const CreateClassSchema = z.object({
  name: z
    .string()
    .min(1, 'La clase debe tener un nombre')
    .max(50, 'El nombre de la clase no puede superar los 50 caracteres'),
  description: z
    .string()
    .min(1, 'La clase debe tener una descripcion')
    .max(100, 'La descripcion de la clase no puede superar los 100 caracteres'),
  category: z.enum(categories, {
    message: `La categoria de la clase debe ser una de las siguientes: ${categories.join(', ')}`,
  }),
  maxNumber: z.coerce
    .number()
    .int()
    .positive('El numero maximo de participantes debe ser mayor que 0')
    .max(
      50,
      'La capacidad maxima de la clase no puede superar los 50 participantes',
    ),
  instructorId: z.coerce
    .number()
    .int()
    .positive('El ID del instructor debe ser un numero mayor que 0'),
  durationMinutes: z.coerce
    .number()
    .int()
    .positive('La duracion de la clase debe ser mayor a 0 minutos')
    .max(180, 'La duracion de la clase no puede superar los 180 minutos'),
});

export const UpdateClassSchema = CreateClassSchema.partial();
export const ClassResponseSchema = CreateClassSchema.extend({
  id: z.number(),
});

export type CreateClassInput = z.infer<typeof CreateClassSchema>;
export type UpdateClassInput = z.infer<typeof UpdateClassSchema>;
export type ClassResponse = z.infer<typeof ClassResponseSchema>;
