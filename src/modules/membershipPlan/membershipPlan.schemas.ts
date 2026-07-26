import { z } from 'zod';

export const PlanIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID debe ser un número').transform(Number),
});

export const CreatePlanSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').max(100),
  description: z
    .string()
    .max(500),
  price: z.number().positive('Precio debe ser un número positivo'),
  durationDays: z.number().int().positive('Duración debe ser un número entero positivo'),
});

export const UpdatePlanSchema = CreatePlanSchema.partial();

export const PlanResponseSchema = CreatePlanSchema.extend({
  id: z.number(),
});

export type CreatePlanInput = z.infer<typeof CreatePlanSchema>;
export type UpdatePlanInput = z.infer<typeof UpdatePlanSchema>;
export type PlanResponse = z.infer<typeof PlanResponseSchema>;