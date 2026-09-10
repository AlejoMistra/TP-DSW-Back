import { z } from 'zod';
import { ExerciseSchema } from '../../generated/zod/schemas/models/Exercise.schema.js';
import { IdSchema } from '../../shared/common.schemas.js';

const exerciseBaseSchema = ExerciseSchema.pick({
  name: true,
  description: true,
  muscleGroup: true,
  difficultyLevel: true,
});

export const CreateExerciseSchema = z.object({
  body: exerciseBaseSchema,
});

export const GetExerciseByIdRequestSchema = z.object({
  params: IdSchema,
});

export const UpdateExerciseSchema = z.object({
  params: IdSchema,
  body: exerciseBaseSchema.partial(),
});

export const DeleteExerciseRequestSchema = z.object({
  params: IdSchema,
});

export const ExerciseResponseSchema = ExerciseSchema.omit({
  deletedAt: true,
});

export type CreateExerciseInput = z.infer<typeof CreateExerciseSchema>['body'];
export type UpdateExerciseInput = z.infer<typeof UpdateExerciseSchema>['body'];
export type ExerciseResponse = z.infer<typeof ExerciseResponseSchema>;
