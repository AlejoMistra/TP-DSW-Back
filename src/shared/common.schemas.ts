import { z } from 'zod';

export const IdSchema = z.object({
  id: z.coerce.number().int().positive('El id debe ser un número entero mayor a 0'),
});

export type IdInput = z.infer<typeof IdSchema>;