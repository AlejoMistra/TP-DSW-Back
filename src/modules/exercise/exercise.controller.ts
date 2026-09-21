import { Request, Response } from 'express';
import { exerciseRepository } from '../../shared/instances.js';
import { ExerciseService } from './exercise.service.js';
import type { CreateExerciseInput, UpdateExerciseInput } from './exercise.schemas.js';

const service = new ExerciseService(exerciseRepository);

function getIdFromReq(req: Request): number | null {
  const validatedParams = req.validated?.params as { id?: number } | undefined;
  const id = validatedParams?.id ?? (req.params.id ? Number(req.params.id) : NaN);
  if (!Number.isFinite(id)) return null;
  return Number(id);
}

export const findAll = async (req: Request, res: Response) => {
  const { muscleGroup, difficulty, name, page, limit } = req.query;
  const pageNum = page ? Number(page) : undefined;
  const limitNum = limit ? Number(limit) : undefined;

  const result = await service.findAll({
    filter: {
      muscleGroup: muscleGroup ? String(muscleGroup) : undefined,
      difficultyLevel: difficulty ? String(difficulty) : undefined,
      name: name ? String(name) : undefined,
    },
    page: pageNum,
    limit: limitNum,
  });

  res.status(200).json(result);
};

export const findOne = async (req: Request, res: Response) => {
  const id = getIdFromReq(req);
  if (id === null) return res.status(400).json({ error: 'ID inválido' });

  const exercise = await service.findOne(id);
  res.status(200).json(exercise);
};

export const create = async (req: Request, res: Response) => {
  // No validamos el rol aquí porque lo hace ensureInstructor en la ruta.
  const body = (req.validated?.body ?? req.body) as CreateExerciseInput;
  const newExercise = await service.create(body);
  res.status(201).json(newExercise);
};

export const update = async (req: Request, res: Response) => {
  const id = getIdFromReq(req);
  if (id === null) return res.status(400).json({ error: 'ID inválido' });

  const payload = (req.validated?.body ?? req.body) as UpdateExerciseInput;
  const updated = await service.update(id, payload);
  res.status(200).json(updated);
};

export const remove = async (req: Request, res: Response) => {
  const id = getIdFromReq(req);
  if (id === null) return res.status(400).json({ error: 'ID inválido' });

  await service.remove(id);
  res.status(204).send();
};