import { Request, Response, NextFunction } from 'express';
import { routineExerciseRepository } from '../../shared/instances.js';
import { RoutineExerciseService } from './routineExercise.service.js';
import type { CreateRoutineExerciseInput, UpdateRoutineExerciseInput } from './routineExercise.schemas.js';

const service = new RoutineExerciseService(routineExerciseRepository);

function getIdFromReq(req: Request): number | null {
  const validatedParams = req.validated?.params as { id?: number } | undefined;
  const id = validatedParams?.id ?? (req.params.id ? Number(req.params.id) : NaN);
  if (!Number.isFinite(id)) return null;
  return Number(id);
}

function getInstructorUserFromReq(req: Request) {

  const userFromReq = (req as any).user as { id?: number; role?: string } | undefined;
  if (userFromReq?.id) return { id: Number(userFromReq.id), role: userFromReq.role ?? 'instructor' };

  
  const instr =
    (req.validated?.body as any)?.instructorId ??
    (req.body?.instructorId ?? undefined);
  const instructorId = instr !== undefined ? Number(instr) : NaN;
  if (!Number.isFinite(instructorId)) return null;
  return { id: instructorId, role: 'instructor' as const };
}

export const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const routineId = req.query.routineId ? Number(req.query.routineId) : undefined;
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const items = await service.findAll(routineId, page, limit);
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

export const findOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getIdFromReq(req);
    if (id === null) return res.status(400).json({ error: 'ID inválido' });

    const item = await service.findOne(id);
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
};

export const findByRoutine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const routineId =
      (req.validated?.params as { routineId?: number } | undefined)?.routineId ??
      (req.params.routineId ? Number(req.params.routineId) : NaN);

    if (!Number.isFinite(routineId)) return res.status(400).json({ error: 'Routine ID inválido' });

    const items = await service.findByRoutine(Number(routineId));
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = (req.validated?.body ?? req.body) as CreateRoutineExerciseInput & { instructorId?: number };
    const user = getInstructorUserFromReq(req);
    if (!user) return res.status(400).json({ error: 'InstructorId obligatorio en el body mientras no haya auth' });

    const created = await service.create(body, user);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getIdFromReq(req);
    if (id === null) return res.status(400).json({ error: 'ID inválido' });

    const payload = (req.validated?.body ?? req.body) as UpdateRoutineExerciseInput & { instructorId?: number };
    const user = getInstructorUserFromReq(req);
    if (!user) return res.status(400).json({ error: 'InstructorId obligatorio en el body mientras no haya auth' });

    const updated = await service.update(id, payload, user);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getIdFromReq(req);
    if (id === null) return res.status(400).json({ error: 'ID inválido' });

    const user = getInstructorUserFromReq(req);
    if (!user) return res.status(400).json({ error: 'InstructorId obligatorio en el body mientras no haya auth' });

    await service.remove(id, user);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};