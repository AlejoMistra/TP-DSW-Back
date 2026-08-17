import { z } from 'zod';
import { ClassCategory } from '../../generated/prisma/client.js';

// Params
export const ClassScheduleIdSchema = z.object({
  id: z.coerce.number().int().positive('ID debe ser un número mayor que 0'),
});

export const ClassScheduleCategorySchema = z.nativeEnum(ClassCategory, {
  message: `La categoría debe ser una de: ${Object.values(ClassCategory).join(', ')}`,
});

// Body create
export const CreateClassScheduleSchema = z.object({
  name: z
    .string()
    .min(1, 'La clase debe tener un nombre')
    .max(50, 'El nombre no puede superar los 50 caracteres'),

  description: z
    .string()
    .max(100, 'La descripción no puede superar los 100 caracteres')
    .optional(),

  category: ClassScheduleCategorySchema,

  // En prisma es maxCapacity (NO maxNumber)
  maxCapacity: z.coerce
    .number()
    .int()
    .positive('La capacidad máxima debe ser mayor a 0')
    .max(50, 'La capacidad máxima no puede superar los 50 participantes'),

  durationMinutes: z.coerce
    .number()
    .int()
    .positive('La duración debe ser mayor a 0 minutos')
    .max(180, 'La duración no puede superar los 180 minutos'),

  instructorId: z.coerce
    .number()
    .int()
    .positive('El ID del instructor debe ser mayor que 0'),

});

// Body update (parcial)
export const UpdateClassScheduleSchema = CreateClassScheduleSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Debe enviar al menos un campo para actualizar' },
);

// Response
export const ClassScheduleResponseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  description: z.string().nullable(),
  category: ClassScheduleCategorySchema,
  maxCapacity: z.number().int().positive(),
  durationMinutes: z.number().int().positive(),
  instructorId: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export type CreateClassScheduleInput = z.infer<typeof CreateClassScheduleSchema>;
export type UpdateClassScheduleInput = z.infer<typeof UpdateClassScheduleSchema>;
export type ClassScheduleResponse = z.infer<typeof ClassScheduleResponseSchema>;