import { z } from 'zod';
import { RoutineSchema } from '../../generated/zod/schemas/models/Routine.schema.js';
import { RoutineExerciseResponseSchema } from '../routineExercise/routineExercise.schemas.js';

// Reuso parcial del modelo generado para la respuesta (omito campos internos)
export const RoutineResponseSchema = RoutineSchema.omit({ deletedAt: true });

// Param id (coerciona "4" -> 4)
const IdParam = z.object({ id: z.coerce.number().int().positive() });

// Query pagination (coerciona strings a numbers)
const ListQuery = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

export const RoutineDetailResponseSchema = RoutineResponseSchema.extend({
  routineExercises: z.array(RoutineExerciseResponseSchema).optional(),
});

// Input para los items de routine (en body: exige number)
export const RoutineExerciseInput = z.object({
  exerciseId: z.number().int().positive(),
  order: z.number().int().nonnegative().optional().nullable(),
  reps: z.number().int().nonnegative().optional().nullable(),
  sets: z.number().int().nonnegative().optional().nullable(),
});

// Create: campos en body (IDs como number)
export const CreateRoutineSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
    // cuerpo exige number (no acepta "4")
    instructorId: z.number().int().positive(),
    exercises: z.array(RoutineExerciseInput).optional(),
  }),
});

// Get by id: params coercion
export const GetRoutineByIdSchema = z.object({
  params: IdParam,
});

// List: coercionar page/limit desde query strings
export const ListRoutinesSchema = z.object({
  query: ListQuery,
});

// Update: params coercion + body (IDs en body como number)
export const UpdateRoutineSchema = z.object({
  params: IdParam,
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().max(1000).optional(),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
    // replace completo de exercises si se envía
    exercises: z.array(RoutineExerciseInput).optional(),
    // instructorId opcional, pero si se envía debe ser number
    instructorId: z.number().int().positive().optional(),
  }),
});

export type CreateRoutineInput = z.infer<typeof CreateRoutineSchema>['body'];
export type UpdateRoutineInput = z.infer<typeof UpdateRoutineSchema>['body'];
export type RoutineResponse = z.infer<typeof RoutineResponseSchema>;
export type RoutineDetailResponse = z.infer<typeof RoutineDetailResponseSchema>;