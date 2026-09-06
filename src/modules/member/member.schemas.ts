import { z } from 'zod';
import { MemberSchema } from '../../generated/zod/schemas/models/Member.schema.js';
import { MembershipSchema } from '../../generated/zod/schemas/models/Membership.schema.js';
import { PaymentSchema } from '../../generated/zod/schemas/models/Payment.schema.js';
import { IdSchema } from '../../shared/common.schemas.js';

const memberBaseSchema = MemberSchema.pick({
  name: true,
  surname: true,
  email: true,
  phone: true,
  docType: true,
  docNumber: true,
  birthDate: true,
  status: true,
});

// Pago inicial opcional al dar de alta un socio; periodStart/periodEnd se derivan de la membresía, no se piden acá.
const memberPaymentInputSchema = PaymentSchema.pick({
  amount: true,
  method: true,
}).extend({
  paymentDate: PaymentSchema.shape.paymentDate.optional(),
});

export const CreateMemberSchema = z.object({
  body: memberBaseSchema.extend({
    membershipPlanId: MembershipSchema.shape.membershipPlanId,
    payment: memberPaymentInputSchema.optional(),
  }),
});

export const GetMemberByIdRequestSchema = z.object({
  params: IdSchema,
});

export const UpdateMemberSchema = z.object({
  params: IdSchema,
  body: memberBaseSchema.partial().extend({
    membershipPlanId: MembershipSchema.shape.membershipPlanId.optional(),
    payment: memberPaymentInputSchema.optional(),
  }),
});

export const DeleteMemberRequestSchema = z.object({
  params: IdSchema,
});

export const MemberResponseSchema = MemberSchema.omit({ deletedAt: true, 
});

export type CreateMemberInput = z.infer<typeof CreateMemberSchema>['body'];
export type UpdateMemberInput = z.infer<typeof UpdateMemberSchema>['body'];
export type MemberResponse = z.infer<typeof MemberResponseSchema>;
export type MemberPaymentInput = z.infer<typeof memberPaymentInputSchema>;
