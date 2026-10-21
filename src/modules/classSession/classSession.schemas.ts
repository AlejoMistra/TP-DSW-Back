import { z } from 'zod';
import { ClassSessionSchema } from '../../generated/zod/schemas/models/ClassSession.schema.js';
import { IdSchema } from '../../shared/common.schemas.js';
import { PaginationQuerySchema } from '../../shared/pagination.js';

export const RecurrenceScopeSchema = z.enum(['this', 'following', 'all']);

export const RecurrenceInputSchema = z.object({
  daysOfWeek: z
    .array(z.coerce.number().int().min(1).max(7))
    .min(1, 'Debe seleccionar al menos un día de la semana'), // 1=Lun, 7=Dom
  endDate: z.coerce.date(),
});

export const ListClassSessionsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(1000).default(500),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'El formato de fecha debe ser YYYY-MM-DD')
    .optional(),
});

export const ListClassSessionsSchema = z.object({
  query: ListClassSessionsQuerySchema.optional(),
});

const classSessionBaseSchema = ClassSessionSchema.pick({
  classScheduleId: true,
  instructorId: true,
  date: true,
  startTime: true,
  status: true,
});

export const CreateClassSessionSchema = z.object({
  body: classSessionBaseSchema.extend({
    recurrence: RecurrenceInputSchema.optional(),
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

// UPDATE: No permite classScheduleId para proteger capacidad y reservas
export const UpdateClassSessionSchema = z
  .object({
    params: IdSchema,
    body: z.object({
      instructorId: z.coerce.number().int().positive().nullable().optional(),
      date: z.coerce.date().optional(),
      startTime: z
        .string()
        .regex(
          /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
          'El formato de hora debe ser HH:mm',
        )
        .optional(),
      status: z.enum(['SCHEDULED', 'CANCELLED']).optional(),
      scope: RecurrenceScopeSchema.default('this'),
    }),
  })
  .refine(
    (data) =>
      !(data.body.date && data.body.scope && data.body.scope !== 'this'),
    {
      message:
        'El cambio de fecha solo está permitido con alcance "this" (sesión individual)',
      path: ['body', 'date'],
    },
  );

// DELETE con soporte de alcance en query
export const DeleteClassSessionRequestSchema = z.object({
  params: IdSchema,
  query: z
    .object({
      scope: RecurrenceScopeSchema.default('this'),
    })
    .optional(),
});

// CANCEL con soporte de alcance en body
export const CancelClassSessionRequestSchema = z.object({
  params: IdSchema,
  body: z
    .object({
      scope: RecurrenceScopeSchema.default('this'),
    })
    .optional(),
});

// Verificación previa de impacto de reservas confirmadas
export const CheckAffectedBookingsSchema = z.object({
  params: IdSchema,
  query: z.object({
    scope: RecurrenceScopeSchema.default('this'),
  }),
});

export const ClassSessionResponseSchema = ClassSessionSchema.omit({
  deletedAt: true,
}).extend({
  endTime: z.string(),
  recurrenceId: z.number().nullable().optional(),
  classSchedule: z.any().optional(),
  instructor: z.any().optional().nullable(),
  recurrence: z.any().optional().nullable(),
});

export type CreateClassSessionInput = z.infer<
  typeof CreateClassSessionSchema
>['body'];
export type UpdateClassSessionInput = z.infer<
  typeof UpdateClassSessionSchema
>['body'];
export type RecurrenceScope = z.infer<typeof RecurrenceScopeSchema>;
export type ClassSessionResponse = z.infer<typeof ClassSessionResponseSchema>;
