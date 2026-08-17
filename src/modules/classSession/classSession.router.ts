import { Router, type Request, type Response } from 'express';
import { classScheduleRepository, classSessionRepository } from '../../shared/instances.js';
import { ClassSessionService } from './classSession.service.js';
import {
  ClassSessionIdSchema,
  CreateClassSessionSchema,
  UpdateClassSessionSchema,
} from './classSession.schema.js';
import { handleError } from '../../utils/errorHandler.js';

export const classSessionRouter = Router();
const service = new ClassSessionService(
  classSessionRepository,
  classScheduleRepository
);

classSessionRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const items = await service.getAll();
    res.status(200).json(items);
  } catch (error) {
    handleError(error, res);
  }
});

classSessionRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = ClassSessionIdSchema.parse({ id: req.params.id });
    const item = await service.getById(id);
    res.status(200).json(item);
  } catch (error) {
    handleError(error, res);
  }
});

classSessionRouter.post('/', async (req: Request, res: Response) => {
  try {
    const body = CreateClassSessionSchema.parse(req.body);
    const created = await service.create(body);
    res.status(201).json(created);
  } catch (error) {
    handleError(error, res);
  }
});

classSessionRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = ClassSessionIdSchema.parse({ id: req.params.id });
    const body = UpdateClassSessionSchema.parse(req.body);
    const updated = await service.update(id, body);
    res.status(200).json(updated);
  } catch (error) {
    handleError(error, res);
  }
});

classSessionRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = ClassSessionIdSchema.parse({ id: req.params.id });
    await service.delete(id);
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
});