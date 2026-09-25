import { z } from 'zod';
import { ClassBookingSchema } from '../../generated/zod/schemas/models/ClassBooking.schema.js';
import { IdSchema } from '../../shared/common.schemas.js';

const classBookingBaseSchema = ClassBookingSchema.pick({
  memberId: true,
  classSessionId: true,
});

export const CreateClassBookingSchema = z.object({
  body: classBookingBaseSchema,
});

export const GetClassBookingByIdRequestSchema = z.object({
  params: IdSchema,
});

export const UpdateClassBookingSchema = z.object({
  params: IdSchema,
  body: ClassBookingSchema.pick({
    status: true,
  }),
});

export const DeleteClassBookingRequestSchema = z.object({
  params: IdSchema,
});

export const ClassBookingResponseSchema = ClassBookingSchema.omit({
  deletedAt: true,
});

export type CreateClassBookingInput = z.infer<typeof CreateClassBookingSchema>['body'];
export type UpdateClassBookingInput = z.infer<typeof UpdateClassBookingSchema>['body'];
export type ClassBookingResponse = z.infer<typeof ClassBookingResponseSchema>;