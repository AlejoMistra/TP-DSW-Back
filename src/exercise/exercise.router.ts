import { Router, Request, Response } from 'express';
import { exerciseRepository } from '../shared/instances.js';
import { ExerciseService } from './exercise.service.js';
import {
  CreateExerciseSchema,
  UpdateExerciseSchema,
  ExerciseIdSchema,
} from './exercise.schemas.js';
import { handleError } from '../utils/errorHandler.js';

export const exerciseRouter = Router();

// Instanciación (En proyectos grandes esto se maneja con Inyección de Dependencias, ej: TSyringe)
const service = new ExerciseService(exerciseRepository);

exerciseRouter.get('/', async (req: Request, res: Response) => {
  try {
    const exercises = await service.getAll();
    res.status(200).json(exercises);
  } catch (error) {
    handleError(error, res);
  }
});

exerciseRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = ExerciseIdSchema.parse({ id: req.params.id });
    const exercise = await service.getById(validatedId.id);
    res.status(200).json(exercise);
  } catch (error) {
    handleError(error, res);
  }
});

exerciseRouter.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = CreateExerciseSchema.parse(req.body);
    const newExercise = await service.create(validatedData);
    res.status(201).json(newExercise);
  } catch (error) {
    handleError(error, res);
  }
});

exerciseRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = ExerciseIdSchema.parse({ id: req.params.id });
    const validatedData = UpdateExerciseSchema.parse(req.body);
    const updatedExercise = await service.update(validatedId.id, validatedData);
    res.status(200).json(updatedExercise);
  } catch (error) {
    handleError(error, res);
  }
});

exerciseRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = ExerciseIdSchema.parse({ id: req.params.id });
    const deleted = await service.delete(validatedId.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Ejercicio no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
});
