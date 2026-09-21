import { z } from 'zod';
import { ClassScheduleSchema } from '../../generated/zod/schemas/models/ClassSchedule.schema.js';
import { IdSchema } from '../../shared/common.schemas.js';

const classScheduleBaseSchema = ClassScheduleSchema.pick({
  name: true,
  description: true,
  category: true,
  maxCapacity: true,
  durationMinutes: true,
});

export const CreateClassScheduleSchema = z.object({
  body: classScheduleBaseSchema,
});

export const GetClassScheduleByIdRequestSchema = z.object({
  params: IdSchema,
});

export const GetClassScheduleByCategoryRequestSchema = z.object({
  params: z.object({
    category: ClassScheduleSchema.shape.category,
  }),
});

export const UpdateClassScheduleSchema = z.object({
  params: IdSchema,
  body: classScheduleBaseSchema.partial(),
});

export const DeleteClassScheduleRequestSchema = z.object({
  params: IdSchema,
});

export const ClassScheduleResponseSchema = ClassScheduleSchema.omit({
  deletedAt: true,
});

export type CreateClassScheduleInput = z.infer<typeof CreateClassScheduleSchema>['body'];
export type UpdateClassScheduleInput = z.infer<typeof UpdateClassScheduleSchema>['body'];
export type ClassScheduleResponse = z.infer<typeof ClassScheduleResponseSchema>;