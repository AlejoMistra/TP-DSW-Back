import { z } from 'zod';
import { GymClassCategory } from './classSchedule.entity.js';

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export const DayOfWeekSchema = z.enum(daysOfWeek, {
  message: `El dia ingresado es invalido`,
});

export const ClassScheduleCategorySchema = z.nativeEnum(GymClassCategory, {
  message: `La Categoria debe pertenecer a algunas de las siguientes: ${Object.values(GymClassCategory).join(', ')}`,
});

export const ClassScheduleIdSchema = z.object({
  id: z.coerce.number().int().positive('ID debe ser un numero mayor que 0'),
});

export const CreateClassScheduleSchema = z.object({
  name: z
    .string()
    .min(1, 'La clase debe tener un nombre')
    .max(50, 'El nombre de la clase no puede superar los 50 caracteres'),
  description: z
    .string()
    .min(1, 'La clase debe tener una descripcion')
    .max(100, 'La descripcion de la clase no puede superar los 100 caracteres'),
  category: z.nativeEnum(GymClassCategory, {
    message: `La categoria de la clase debe ser una de las siguientes: ${Object.values(GymClassCategory).join(', ')}`,
  }),
  maxNumber: z.coerce
    .number()
    .int()
    .positive('El numero maximo de participantes debe ser mayor que 0')
    .max(
      50,
      'La capacidad maxima de la clase no puede superar los 50 participantes',
    ),

  durationMinutes: z.coerce
    .number()
    .int()
    .positive('La duracion de la clase debe ser mayor a 0 minutos')
    .max(180, 'La duracion de la clase no puede superar los 180 minutos'),
  instructorId: z.coerce
    .number()
    .int()
    .positive('El ID del instructor debe ser un numero mayor que 0'),
  dayOfWeek: DayOfWeekSchema,
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'El formato debe ser HH:mm (ejemplo: 08:00)'),
});

export const UpdateClassScheduleSchema = CreateClassScheduleSchema.partial();
export const ClassScheduleResponseSchema = CreateClassScheduleSchema.extend({
  id: z.number(),
});

export type CreateClassScheduleInput = z.infer<
  typeof CreateClassScheduleSchema
>;
export type UpdateClassScheduleInput = z.infer<
  typeof UpdateClassScheduleSchema
>;
export type ClassScheduleResponse = z.infer<typeof ClassScheduleResponseSchema>;
