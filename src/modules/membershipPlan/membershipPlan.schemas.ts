import { z } from 'zod';
import { MembershipPlanSchema } from '../../generated/zod/schemas/models/MembershipPlan.schema.js';
import { IdSchema } from '../../shared/common.schemas.js';

const membershipPlanBaseSchema = MembershipPlanSchema.pick({
  name: true,
  description: true,
  price: true,
  durationDays: true,
});

export const CreateMembershipPlanSchema = z.object({
  body: membershipPlanBaseSchema,
});

export const GetMembershipPlanByIdRequestSchema = z.object({
  params: IdSchema,
});

export const UpdateMembershipPlanSchema = z.object({
  params: IdSchema,
  body: membershipPlanBaseSchema.partial(),
});

export const DeleteMembershipPlanRequestSchema = z.object({ 
  params: IdSchema,
});

export const MembershipPlanResponseSchema = MembershipPlanSchema.omit({
  deletedAt: true,
});

export type CreateMembershipPlanInput = z.infer<typeof CreateMembershipPlanSchema>['body'];
export type UpdateMembershipPlanInput = z.infer<typeof UpdateMembershipPlanSchema>['body'];
export type MembershipPlanResponse = z.infer<typeof MembershipPlanResponseSchema>;