import { z } from 'zod';
import { MemberSchema } from '../../generated/zod/schemas/models/Member.schema.js';
import { MembershipSchema } from '../../generated/zod/schemas/models/Membership.schema.js';
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

export const CreateMemberSchema = z.object({
  body: memberBaseSchema.extend({
    membershipPlanId: MembershipSchema.shape.membershipPlanId,
  }),
});

export const GetMemberByIdRequestSchema = z.object({
  params: IdSchema,
});

export const UpdateMemberSchema = z.object({
  params: IdSchema,
  body: memberBaseSchema.partial().extend({
    membershipPlanId: MembershipSchema.shape.membershipPlanId.optional(),
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
