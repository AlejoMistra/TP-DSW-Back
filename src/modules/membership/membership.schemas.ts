import { z } from 'zod';
import { MembershipSchema } from '../../generated/zod/schemas/models/Membership.schema.js';
import { MembershipStatusSchema } from '../../generated/zod/schemas/enums/MembershipStatus.schema.js';
import { IdSchema } from '../../shared/common.schemas.js';

const membershipCreateBodySchema = MembershipSchema.pick({
  memberId: true,
  membershipPlanId: true,
  startDate: true,
  endDate: true,
  status: true,
});

const membershipUpdateBodySchema = MembershipSchema.pick({
  memberId: true,
  membershipPlanId: true,
  startDate: true,
  endDate: true,
}).extend({
  status: MembershipStatusSchema,
}).partial().refine((data) => Object.keys(data).length > 0, {
  message: 'Se debe proporcionar al menos un campo para actualizar',
});

export const CreateMembershipSchema = z.object({
  body: membershipCreateBodySchema,
});

export const GetMembershipByIdRequestSchema = z.object({
  params: IdSchema,
});

export const GetMembershipByMemberIdRequestSchema = z.object({
  params: z.object({
    memberId: IdSchema.shape.id,
  }),
});

export const UpdateMembershipSchema = z.object({
  params: IdSchema,
  body: membershipUpdateBodySchema,
});

export const DeleteMembershipRequestSchema = z.object({
  params: IdSchema,
});

export const MembershipResponseSchema = MembershipSchema.omit({
  deletedAt: true,
}).extend({
  status: z.string(),
});

export type CreateMembershipInput = z.infer<typeof CreateMembershipSchema>['body'];
export type UpdateMembershipInput = z.infer<typeof UpdateMembershipSchema>['body'];
export type MembershipResponse = z.infer<typeof MembershipResponseSchema>;