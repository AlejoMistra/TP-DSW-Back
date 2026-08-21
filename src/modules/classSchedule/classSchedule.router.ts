import { Router, type Request, type Response } from 'express';
import { ClassScheduleService } from './classSchedule.service.js';
import {
  ClassScheduleIdSchema,
  CreateClassScheduleSchema,
  UpdateClassScheduleSchema,
  ClassScheduleCategorySchema,
} from './classSchedule.schemas.js';
import { classScheduleRepository, instructorRepository } from '../../shared/instances.js';
import { handleError } from '../../utils/errorHandler.js';

export const classScheduleRouter = Router();

const service = new ClassScheduleService(
  classScheduleRepository,
  instructorRepository,
);

// GET /api/classSchedules
classScheduleRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const items = await service.getAll();
    res.status(200).json(items);
  } catch (error) {
    handleError(error, res);
  }
});

// GET /api/classSchedules/:id
classScheduleRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = ClassScheduleIdSchema.parse({ id: req.params.id });
    const item = await service.getById(id);
    res.status(200).json(item);
  } catch (error) {
    handleError(error, res);
  }
});

// GET /api/classSchedules/instructor/:instructorId
classScheduleRouter.get('/instructor/:instructorId', async (req: Request, res: Response) => {
  try {
    const { id: instructorId } = ClassScheduleIdSchema.parse({
      id: req.params.instructorId,
    });
    const items = await service.getByInstructor(instructorId);
    res.status(200).json(items);
  } catch (error) {
    handleError(error, res);
  }
});

// GET /api/classSchedules/category/:category
classScheduleRouter.get('/category/:category', async (req: Request, res: Response) => {
  try {
    const category = ClassScheduleCategorySchema.parse(req.params.category);
    const items = await service.getByCategory(category);
    res.status(200).json(items);
  } catch (error) {
    handleError(error, res);
  }
});

// POST /api/classSchedules
classScheduleRouter.post('/', async (req: Request, res: Response) => {
  try {
    const body = CreateClassScheduleSchema.parse(req.body);
    const created = await service.create(body);
    res.status(201).json(created);
  } catch (error) {
    handleError(error, res);
  }
});

// PUT /api/classSchedules/:id
classScheduleRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = ClassScheduleIdSchema.parse({ id: req.params.id });
    const body = UpdateClassScheduleSchema.parse(req.body);
    const updated = await service.update(id, body);
    res.status(200).json(updated);
  } catch (error) {
    handleError(error, res);
  }
});

// DELETE /api/classSchedules/:id (soft delete)
classScheduleRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = ClassScheduleIdSchema.parse({ id: req.params.id });
    await service.delete(id);
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
});