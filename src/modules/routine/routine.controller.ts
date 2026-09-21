import { Request, Response } from 'express';
import { routineRepository } from '../../shared/instances.js';
import { RoutineService } from './routine.service.js';
import type { CreateRoutineInput, UpdateRoutineInput } from './routine.schemas.js';

const service = new RoutineService(routineRepository);

function getIdFromReq(req: Request): number | null {
  const validatedParams = req.validated?.params as { id?: number } | undefined;
  const id = validatedParams?.id ?? (req.params.id ? Number(req.params.id) : NaN);
  if (!Number.isFinite(id)) return null;
  return Number(id);
}

function getInstructorUserFromReq(req: Request) {
  const userFromReq = (req as any).user as { id?: number; role?: string } | undefined;
  if (userFromReq?.id) return { id: Number(userFromReq.id), role: userFromReq.role ?? 'instructor' };

  const instr = (req.validated?.body as any)?.instructorId ?? (req.body?.instructorId ?? undefined);
  const instructorId = instr !== undefined ? Number(instr) : NaN;
  if (!Number.isFinite(instructorId)) return null;
  return { id: instructorId, role: 'instructor' as const };
}

export const findAll = async (req: Request, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const routines = await service.findAll(page, limit);
  res.status(200).json(routines);
};

export const findOne = async (req: Request, res: Response) => {
  const id = getIdFromReq(req);
  if (id === null) return res.status(400).json({ error: 'ID inválido' });
  const routine = await service.findOne(id);
  res.status(200).json(routine);
};

export const create = async (req: Request, res: Response) => {
  const { body } = req.validated!;
  const user = getInstructorUserFromReq(req);
  if (!user) return res.status(400).json({ error: 'InstructorId obligatorio en body mientras no haya auth' });

  const newRoutine = await service.create(body as CreateRoutineInput, user);
  res.status(201).json(newRoutine);
};

export const update = async (req: Request, res: Response) => {
  const id = getIdFromReq(req);
  if (id === null) return res.status(400).json({ error: 'ID inválido' });

  const { body } = req.validated!;
  const user = getInstructorUserFromReq(req);
  if (!user) return res.status(400).json({ error: 'InstructorId obligatorio en body mientras no haya auth' });

  const updated = await service.update(id, body as UpdateRoutineInput, user);
  res.status(200).json(updated);
};

export const remove = async (req: Request, res: Response) => {
  const id = getIdFromReq(req);
  if (id === null) return res.status(400).json({ error: 'ID inválido' });

  const user = getInstructorUserFromReq(req);
  if (!user) return res.status(400).json({ error: 'InstructorId obligatorio en body mientras no haya auth' });

  await service.remove(id, user);
  res.status(204).send();
};