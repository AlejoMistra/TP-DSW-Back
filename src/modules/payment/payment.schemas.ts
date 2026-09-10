import { z } from 'zod';
import { PaymentSchema } from '../../generated/zod/schemas/models/Payment.schema.js';
import { IdSchema } from '../../shared/common.schemas.js';

const paymentBaseSchema = PaymentSchema.pick({
  amount: true,
  method: true,
  periodStart: true,
  periodEnd: true,
}).extend({
  membershipId: PaymentSchema.shape.membershipId.optional(),
  paymentDate: PaymentSchema.shape.paymentDate.optional(),
});

export const CreatePaymentSchema = z.object({
  body: paymentBaseSchema,
  params: z.object({
    membershipId: z.coerce.number().int().positive().optional(),
  }).optional(),
});

export const GetPaymentByIdRequestSchema = z.object({
  params: IdSchema,
});

export const UpdatePaymentSchema = z.object({
  params: IdSchema,
  body: paymentBaseSchema.partial(),
});

export const DeletePaymentRequestSchema = z.object({
  params: IdSchema,
});

export const PaymentQuerySchema = z.object({
  query: z.object({
    membershipId: z.coerce.number().int().positive().optional(),
  }).optional(),
});

export const PaymentResponseSchema = PaymentSchema.omit({
  deletedAt: true,
});

export type CreatePaymentInput = z.infer<typeof paymentBaseSchema> & { membershipId: number };
export type UpdatePaymentInput = z.infer<typeof UpdatePaymentSchema>['body'];
export type PaymentResponse = z.infer<typeof PaymentResponseSchema>;
