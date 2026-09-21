import { z } from 'zod';
import { UserSchema } from '../../generated/zod/schemas/models/User.schema.js';
import { IdSchema } from '../../shared/common.schemas.js';

const userBaseSchema = UserSchema.pick({
  email: true,
  role: true,
}).extend({
  passwordHash: z.string().nullable().optional(),
  accountStatus: UserSchema.shape.accountStatus.optional(),
  isActive: z.boolean().optional(),
});

export const CreateUserSchema = z.object({
  body: userBaseSchema,
});

export const UpdateUserSchema = z.object({
  params: IdSchema,
  body: userBaseSchema.partial(),
});

export const DeleteUserSchema = z.object({
  params: IdSchema,
});

export const UserResponseSchema = UserSchema.omit({
  passwordHash: true,
  deletedAt: true,
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>['body'];
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>['body'];
export type UserResponse = z.infer<typeof UserResponseSchema>;
