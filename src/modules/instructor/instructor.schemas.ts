import { z } from 'zod';
import { InstructorSchema } from '../../generated/zod/schemas/models/Instructor.schema.js';
import { IdSchema } from '../../shared/common.schemas.js';

const instructorBaseSchema = InstructorSchema.pick({
  name: true,
  surname: true,
  email: true,
  phone: true,
});

export const CreateInstructorSchema = z.object({
  body: instructorBaseSchema,
});

export const GetInstructorByIdRequestSchema = z.object({
  params: IdSchema,
});

export const UpdateInstructorSchema = z.object({
  params: IdSchema,
  body: instructorBaseSchema.partial(),
});

export const DeleteInstructorRequestSchema = z.object({
  params: IdSchema,
});

export const InstructorResponseSchema = InstructorSchema.omit({
  deletedAt: true,
});

export type CreateInstructorInput = z.infer<
  typeof CreateInstructorSchema
>['body'];

export type UpdateInstructorInput = z.infer<
  typeof UpdateInstructorSchema
>['body'];

export type InstructorResponse = z.infer<
  typeof InstructorResponseSchema
>;