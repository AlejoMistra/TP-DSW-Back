import { z } from 'zod';

const paymentMethodEnum = z.enum([
  'CREDIT_CARD',
  'DEBIT_CARD',
  'TRANSFER',
  'CASH',
  'OTHER',
]);

export const MembershipIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID debe ser un número').transform(Number),
});

export const CreateMembershipSchema = z.object({
  memberId: z.string().regex(/^\d+$/, 'ID de usuario debe ser un número').transform(Number),
  membershipPlanId: z.string().regex(/^\d+$/, 'ID de plan debe ser un número').transform(Number),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Fecha de inicio inválida',
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Fecha de fin inválida',
  }),
  lastPaymentMethod: paymentMethodEnum.optional(),
  lastPaymentDate: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: 'Fecha de último pago inválida',
  }),
  lastPaymentAmount: z
    .number()
    .nonnegative('Monto de último pago debe ser un número no negativo')
    .optional(),
});

export const UpdateMembershipSchema = CreateMembershipSchema.partial();

export const MembershipResponseSchema = z.object({
  id: z.number(),
  memberId: z.number(),
  membershipPlanId: z.number(),
  startDate: z.date(),
  endDate: z.date(),
  lastPaymentMethod: paymentMethodEnum.optional(),
  lastPaymentDate: z.date().optional(),
  lastPaymentAmount: z.number().nonnegative().optional(),
});

export type CreateMembershipInput = z.infer<typeof CreateMembershipSchema>;
export type UpdateMembershipInput = z.infer<typeof UpdateMembershipSchema>;
export type MembershipResponse = z.infer<typeof MembershipResponseSchema>;