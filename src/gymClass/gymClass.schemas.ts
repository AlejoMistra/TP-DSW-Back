import { z } from 'zod';

const categories = ['yoga', 'spinning', 'crossfit', 'pilates'] as const;

export const GymClassCategorySchema = z.enum(categories, {
  message: `La Categoria debe pertenecer a algunas de las siguientes: ${categories.join(', ')}`,
});

export const GymClassIdSchema = z.object({
  id: z.coerce.number().int().positive('ID debe ser un numero mayor que 0'),
});

export const CreateGymClassSchema = z.object({
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

export const UpdateGymClassSchema = CreateGymClassSchema.partial();
export const GymClassResponseSchema = CreateGymClassSchema.extend({
  id: z.number(),
});

export type CreateGymClassInput = z.infer<typeof CreateGymClassSchema>;
export type UpdateGymClassInput = z.infer<typeof UpdateGymClassSchema>;
export type GymClassResponse = z.infer<typeof GymClassResponseSchema>;
