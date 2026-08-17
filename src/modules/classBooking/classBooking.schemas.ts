import { z } from 'zod';

export const ClassBookingIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID debe ser un número').transform(Number),
});

export const CreateClassBookingSchema = z.object({
  memberId: z.number().int().positive(),
  classSessionId: z.number().int().positive(),
});

// UPDATE SOLO STATUS
export const UpdateClassBookingSchema = z
  .object({
    status: z.enum(['CONFIRMED', 'CANCELLED']),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debe enviar al menos un campo para actualizar',
  });

export const ClassBookingResponseSchema = z.object({
  id: z.number(),
  memberId: z.number().int().positive(),
  classSessionId: z.number().int().positive(),
  bookingDate: z.coerce.date(),
  status: z.enum(['CONFIRMED', 'CANCELLED']),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export type CreateClassBookingInput = z.infer<typeof CreateClassBookingSchema>;
export type UpdateClassBookingInput = z.infer<typeof UpdateClassBookingSchema>;
export type ClassBookingResponse = z.infer<typeof ClassBookingResponseSchema>;