import {z} from 'zod';

export const ExerciseIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID debe ser un número').transform(Number),
});

export const CreateExerciseSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').max(100),
  description: z.string().min(5, 'Descripción debe tener al menos 5 caracteres').max(500),
  muscleGroup: z.string().min(2, 'Grupo muscular debe tener al menos 2 caracteres').max(100),
  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced']),//.default('intermediate'),
}).strict();

export const UpdateExerciseSchema = CreateExerciseSchema.partial();

export const ExerciseResponseSchema = CreateExerciseSchema.extend({
  id: z.number().int().positive(),
});

export type CreateExerciseInput = z.infer<typeof CreateExerciseSchema>;
export type UpdateExerciseInput = z.infer<typeof UpdateExerciseSchema>;
export type ExerciseResponse = z.infer<typeof ExerciseResponseSchema>;