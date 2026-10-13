import { z } from 'zod';
import { ClassSessionSchema } from '../../generated/zod/schemas/models/ClassSession.schema.js';
import { IdSchema } from '../../shared/common.schemas.js';
import { PaginationQuerySchema } from '../../shared/pagination.js';

export const ListClassSessionsSchema = z.object({
  query: PaginationQuerySchema.optional(),
});

const classSessionBaseSchema = ClassSessionSchema.pick({
  classScheduleId: true,
  instructorId: true,
  date: true,
  startTime: true,
  status: true,
});

const recurrenceSchema = z.object({
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
  interval: z.number().int().min(1).max(12).default(1),
  endDate: z.coerce.date(),
});

export const RecurrenceScopeSchema = z.enum(['THIS', 'ALL', 'FOLLOWING']).default('THIS');

// Query común para editar/cancelar y eliminar con alcance
const scopeQuerySchema = z.object({
  scope: RecurrenceScopeSchema,
  confirm: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
});

export const CreateClassSessionSchema = z.object({
  body: classSessionBaseSchema
    .extend({ recurrence: recurrenceSchema.optional() })
    .refine((data) => !data.recurrence || data.recurrence.endDate >= data.date, {
      message: 'La fecha de fin de la recurrencia no puede ser anterior a la fecha de la sesión',
      path: ['recurrence', 'endDate'],
    }),
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
  query: scopeQuerySchema,
});

export const DeleteClassSessionRequestSchema = z.object({
  params: IdSchema,
  query: scopeQuerySchema,
});

export const ClassSessionResponseSchema = ClassSessionSchema.omit({
  deletedAt: true,
}).extend({
  endTime: z.string(),
});

export type CreateClassSessionInput = z.infer<typeof CreateClassSessionSchema>['body'];
export type UpdateClassSessionInput = z.infer<typeof UpdateClassSessionSchema>['body'];
export type ClassSessionResponse = z.infer<typeof ClassSessionResponseSchema>;

export type RecurrenceScope = z.infer<typeof RecurrenceScopeSchema>;
export type RecurrenceInput = NonNullable<CreateClassSessionInput['recurrence']>;