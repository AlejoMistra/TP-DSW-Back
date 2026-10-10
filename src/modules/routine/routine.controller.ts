import { Request, Response } from 'express';
import { routineService } from '../../shared/instances.js';
import type {
  CreateRoutineInput,
  UpdateRoutineInput,
} from './routine.schemas.js';
import { BadRequestError, UnauthorizedError } from '../../utils/errors.js';

function getIdFromReq(req: Request): number | null {
  const validatedParams = req.validated?.params as { id?: number } | undefined;
  const id =
    validatedParams?.id ?? (req.params.id ? Number(req.params.id) : NaN);
  if (!Number.isFinite(id)) return null;
  return Number(id);
}

function getAuthUser(req: Request) {
  if (!req.user) {
    throw new UnauthorizedError('Usuario no autenticado');
  }
  return req.user;
}

export const findAll = async (req: Request, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const routines = await routineService.findAll(page, limit);
  res.status(200).json(routines);
};

export const findOne = async (req: Request, res: Response) => {
  const id = getIdFromReq(req);
  if (id === null) {
    throw new BadRequestError('ID inválido');
  }
  const routine = await routineService.findOne(id);
  res.status(200).json(routine);
};

export const create = async (req: Request, res: Response) => {
  const { body } = req.validated!;
  const user = getAuthUser(req);
  const newRoutine = await routineService.create(
    body as CreateRoutineInput,
    user,
  );
  res.status(201).json(newRoutine);
};

export const update = async (req: Request, res: Response) => {
  const id = getIdFromReq(req);
  if (id === null) {
    throw new BadRequestError('ID inválido');
  }
  const { body } = req.validated!;
  const user = getAuthUser(req);
  const updated = await routineService.update(
    id,
    body as UpdateRoutineInput,
    user,
  );
  res.status(200).json(updated);
};

export const remove = async (req: Request, res: Response) => {
  const id = getIdFromReq(req);
  if (id === null) {
    throw new BadRequestError('ID inválido');
  }
  const user = getAuthUser(req);
  await routineService.remove(id, user);
  res.status(204).send();
};
