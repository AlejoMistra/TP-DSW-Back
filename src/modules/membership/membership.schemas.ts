import { z } from 'zod';

// FIXME: CONVIENE IMPORTAR DIRECTAMENTE LOS ENUMS DESDE PRISMA CLIENT PARA EVITAR INCONSISTENCIAS
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
  memberId: z.coerce.number().int().positive('ID de usuario debe ser un número mayor que 0'),
  membershipPlanId: z.coerce.number().int().positive('ID de plan debe ser un número mayor que 0'),
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
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  lastPaymentMethod: paymentMethodEnum.optional(),
  lastPaymentDate: z.coerce.date().optional(),
  lastPaymentAmount: z.number().nonnegative().optional(),
});

export type CreateMembershipInput = z.infer<typeof CreateMembershipSchema>;
export type UpdateMembershipInput = z.infer<typeof UpdateMembershipSchema>;
export type MembershipResponse = z.infer<typeof MembershipResponseSchema>;