import { z } from 'zod';

//El schema de id no creo que haga falta porque se genera con prisma
export const ClassSessionIdSchema = z.object({
  id: z.coerce.number().int().positive('ID debe ser un número positivo'),
});

// export const CreateClassSessionSchema = z.object({
//   classScheduleId: z.number().int().positive(),
//   date: z.coerce.date(),
//   startTime: z.coerce.date(),
//   endTime: z.coerce.date(),
//   remainingCapacity: z.number().int().min(0),
//   status: z.enum(['SCHEDULED', 'CANCELLED']).default('SCHEDULED'),
// });

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const CreateClassSessionSchema = z.object({
  classScheduleId: z.coerce.number().int().positive(),
  date: z.string().transform((v) => new Date(v)),
  startTime: z.string().regex(timeRegex, 'Formato HH:mm'),
  endTime: z.string().regex(timeRegex, 'Formato HH:mm'),
  status: z.enum(['SCHEDULED', 'CANCELLED']).default('SCHEDULED').optional(),
});

export const UpdateClassSessionSchema = z.object({
  classScheduleId: z.coerce.number().int().positive().optional(),
  date: z.string().transform((v) => new Date(v)).optional(),
  startTime: z.string().regex(timeRegex, 'Formato HH:mm').optional(),
  endTime: z.string().regex(timeRegex, 'Formato HH:mm').optional(),
  remainingCapacity: z.coerce.number().int().nonnegative().optional(),
  status: z.enum(['SCHEDULED', 'CANCELLED']).optional(),
});
  
export const ClassSessionResponseSchema = z.object({
  id: z.number().int().positive(),
  classScheduleId: z.number().int().positive(),
  date: z.string().transform((v) => new Date(v)),
  startTime: z.string().regex(timeRegex, 'Formato HH:mm'),
  endTime: z.string().regex(timeRegex, 'Formato HH:mm'),
  remainingCapacity: z.number().int().min(0),
  status: z.enum(['SCHEDULED', 'CANCELLED']),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export type CreateClassSessionInput = z.infer<typeof CreateClassSessionSchema>;
export type UpdateClassSessionInput = z.infer<typeof UpdateClassSessionSchema>;
export type ClassSessionResponse = z.infer<typeof ClassSessionResponseSchema>;