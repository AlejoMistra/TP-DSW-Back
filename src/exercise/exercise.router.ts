import { Router, Request, Response } from 'express';
import { ExerciseRepository } from '../exercise/exercise.repository.js';
import { ExerciseService } from './exercise.service.js';
import {
  CreateExerciseSchema,
  UpdateExerciseSchema,
  ExerciseIdSchema,
} from './exercise.schemas.js';
import { z } from 'zod';

export const exerciseRouter = Router();

// Instanciación (En proyectos grandes esto se maneja con Inyección de Dependencias, ej: TSyringe)
const repository = new ExerciseRepository();
const service = new ExerciseService(repository);

exerciseRouter.get('/', async (req: Request, res: Response) => {
  try {
    const exercises = await service.getAll();
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los ejercicios' });
  }
});

exerciseRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = ExerciseIdSchema.parse({ id: req.params.id });
    const exercise = await service.getById(validatedId.id);
    res.status(200).json(exercise);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: 'Parámetros inválidos', errors: error.issues });
    }
    if (error instanceof Error) res.status(404).json({ error: error.message });
  }
});

exerciseRouter.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = CreateExerciseSchema.parse(req.body);
    const newExercise = await service.create(validatedData);
    res.status(201).json(newExercise);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Validación fallida', details: error.issues });
    }
    res.status(500).json({ message: 'Error al crear el ejercicio' });
  }
});

exerciseRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = ExerciseIdSchema.parse({ id: req.params.id });
    const validatedData = UpdateExerciseSchema.parse(req.body);
    const updatedExercise = await service.update(validatedId.id, validatedData);

    if (!updatedExercise) {
      return res.status(404).json({ error: 'Ejercicio no encontrado' });
    }
    res.status(200).json(updatedExercise);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Validación fallida', details: error.issues });
    }
    res.status(500).json({ message: 'Error al actualizar el ejercicio' });
  }
});

exerciseRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = ExerciseIdSchema.parse({ id: req.params.id });
    const deleted = await service.delete(validatedId.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Ejercicio no encontrado' });
    }
    res.status(200).json({ message: 'Ejercicio eliminado correctamente' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Validación fallida', details: error.issues });
    }
    res.status(500).json({ message: 'Error al eliminar el ejercicio' });
  }
});
