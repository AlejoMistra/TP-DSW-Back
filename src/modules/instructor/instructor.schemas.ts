import { z } from 'zod';
import { InstructorSchema } from '../../generated/zod/schemas/models/Instructor.schema.js';
import { IdSchema } from '../../shared/common.schemas.js';

const instructorBaseSchema = InstructorSchema.pick({
  name: true,
  surname: true,
  phone: true,
  docType: true,
  docNumber: true,
});

export const CreateInstructorSchema = z.object({
  body: instructorBaseSchema.extend({
    email: z.string().email('Email inválido'),
  }),
});

export const GetInstructorByIdRequestSchema = z.object({
  params: IdSchema,
});

export const UpdateInstructorSchema = z.object({
  params: IdSchema,
  body: instructorBaseSchema.partial().extend({
    email: z.string().email('Email inválido').optional(),
  }),
});

export const DeleteInstructorRequestSchema = z.object({
  params: IdSchema,
});

export const InstructorResponseSchema = InstructorSchema.omit({
  deletedAt: true,
}).extend({
  email: z.string().email(),
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