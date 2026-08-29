import { z } from 'zod';
import { MembershipSchema } from '../../generated/zod/schemas/models/Membership.schema.js';

export const MembershipIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID debe ser un número').transform(Number),
});

const membershipBaseSchema = z.object({
  memberId: MembershipSchema.shape.memberId,
  membershipPlanId: MembershipSchema.shape.membershipPlanId,
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Fecha de inicio inválida',
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Fecha de fin inválida',
  }),
  status: MembershipSchema.shape.status.optional(),
});

export const CreateMembershipSchema = membershipBaseSchema;

export const UpdateMembershipSchema = membershipBaseSchema.partial();

export const MembershipResponseSchema = MembershipSchema.omit({
  deletedAt: true,
}).extend({
  status: z.string(),
});

export type CreateMembershipInput = z.infer<typeof CreateMembershipSchema>;
export type UpdateMembershipInput = z.infer<typeof UpdateMembershipSchema>;
export type MembershipResponse = z.infer<typeof MembershipResponseSchema>;