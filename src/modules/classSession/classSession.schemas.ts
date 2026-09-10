import { z } from 'zod';
import { ClassSessionSchema } from '../../generated/zod/schemas/models/ClassSession.schema.js';
import { IdSchema } from '../../shared/common.schemas.js';

const classSessionBaseSchema = ClassSessionSchema.pick({
  classScheduleId: true,
  instructorId: true,
  date: true,
  startTime: true,
  status: true,
});

export const CreateClassSessionSchema = z.object({
  body: classSessionBaseSchema,
});

export const GetClassSessionByIdRequestSchema = z.object({
  params: IdSchema,
});

export const GetClassSessionByInstructorRequestSchema = z.object({
  params: z.object({
    instructorId: z.coerce.number().int().positive(),
  }),
});

export const GetClassSessionByScheduleRequestSchema = z.object({
  params: z.object({
    classScheduleId: z.coerce.number().int().positive(),
  }),
});

export const UpdateClassSessionSchema = z.object({
  params: IdSchema,
  body: classSessionBaseSchema.partial(),
});

export const DeleteClassSessionRequestSchema = z.object({
  params: IdSchema,
});

export const ClassSessionResponseSchema = ClassSessionSchema.omit({
  deletedAt: true,
}).extend({
  endTime: z.string(),
});

export type CreateClassSessionInput = z.infer<typeof CreateClassSessionSchema>['body'];
export type UpdateClassSessionInput = z.infer<typeof UpdateClassSessionSchema>['body'];
export type ClassSessionResponse = z.infer<typeof ClassSessionResponseSchema>;
