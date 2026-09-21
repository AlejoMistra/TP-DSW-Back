import { z } from 'zod';
import { RoutineExerciseSchema } from '../../generated/zod/schemas/models/RoutineExercise.schema.js';
import { ExerciseResponseSchema } from '../exercise/exercise.schemas.js';

// Reuso para response
export const RoutineExerciseResponseSchema = RoutineExerciseSchema
  .omit({ deletedAt: true })
  .extend({
    exercise: ExerciseResponseSchema.optional(),
  });

// Param id coercionado
const IdParam = z.object({ id: z.coerce.number().int().positive() });

// Para listar por routine (routineId viene en params, coercionado)
export const GetRoutineExercisesByRoutineRequestSchema = z.object({
  params: z.object({ routineId: z.coerce.number().int().positive() }),
});

// Body base (en body exigimos numbers para ids)
const RoutineExerciseBodyBase = z.object({
  routineId: z.number().int().positive(),
  exerciseId: z.number().int().positive(),
  order: z.number().int().nonnegative().optional().nullable(),
  reps: z.number().int().nonnegative().optional().nullable(),
  sets: z.number().int().nonnegative().optional().nullable(),
  weight: z.number().nonnegative().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});


export const CreateRoutineExerciseSchema = z.object({
  body: RoutineExerciseBodyBase,
});

export const GetRoutineExerciseByIdRequestSchema = z.object({
  params: IdParam,
});

export const UpdateRoutineExerciseSchema = z.object({
  params: IdParam,
  body: RoutineExerciseBodyBase.partial(),
});

export const DeleteRoutineExerciseRequestSchema = z.object({
  params: IdParam,
});

export type CreateRoutineExerciseInput = z.infer<typeof CreateRoutineExerciseSchema>['body'];
export type UpdateRoutineExerciseInput = z.infer<typeof UpdateRoutineExerciseSchema>['body'];
export type RoutineExerciseResponse = z.infer<typeof RoutineExerciseResponseSchema>;