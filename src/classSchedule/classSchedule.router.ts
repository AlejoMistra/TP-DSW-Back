import { Router, Request, Response } from 'express';
import {
  classScheduleRepository,
  instructorRepository,
} from '../shared/instances.js';
import { ClassScheduleService } from './classSchedule.service.js';
import {
  ClassScheduleIdSchema,
  ClassScheduleCategorySchema,
  CreateClassScheduleSchema,
  UpdateClassScheduleSchema,
  DayOfWeekSchema,
} from './classSchedule.schemas.js';
import { getErrorMessage } from '../utils/errorHandler.js';
import { z } from 'zod';

export const classScheduleRouter = Router();
const service = new ClassScheduleService(
  classScheduleRepository,
  instructorRepository,
);

//GET /api/classSchedules
classScheduleRouter.get('/', async (req: Request, res: Response) => {
  try {
    const classSchedules = await service.getAll();
    res.status(200).json(classSchedules);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al obtener los horarios de clases' });
  }
});

// GET /api/classSchedules/:id
classScheduleRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = ClassScheduleIdSchema.parse({ id: req.params.id });
    const schedule = await service.getById(validatedId.id);
    return res.status(200).json(schedule);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Id invalido',
        details: error.issues,
      });
    }
    return res.status(404).json({ error: getErrorMessage(error) });
  }
});
// GET /api/classSchedules/instructor/:instructorId
classScheduleRouter.get(
  '/instructor/:instructorId',
  async (req: Request, res: Response) => {
    try {
      const validatedId = ClassScheduleIdSchema.parse({
        id: req.params.instructorId,
      });
      const schedules = await service.getByInstructor(validatedId.id);
      return res.status(200).json(schedules);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Id invalido',
          details: error.issues,
        });
      }
      return res.status(404).json({ error: getErrorMessage(error) });
    }
  },
);

classScheduleRouter.get(
  '/category/:category',
  async (req: Request, res: Response) => {
    try {
      const validatedCategory = ClassScheduleCategorySchema.parse(
        req.params.category,
      );
      const schedules = await service.getByCategory(validatedCategory);
      return res.status(200).json(schedules);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Categoria invalida',
          details: error.issues,
        });
      }
      return res
        .status(500)
        .json({ message: 'Error al obtener los horarios por categoria' });
    }
  },
);

classScheduleRouter.get(
  '/day/:dayOfWeek',
  async (req: Request, res: Response) => {
    try {
      const validatedDay = DayOfWeekSchema.parse(req.params.dayOfWeek);
      const schedules = await service.getByDayOfWeek(validatedDay);
      return res.status(200).json(schedules);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Dia de la semana invalido',
          details: error.issues,
        });
      }
      return res.status(500).json({
        message: 'Error al obtener los horarios por dia de la semana',
      });
    }
  },
);

classScheduleRouter.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = CreateClassScheduleSchema.parse(req.body);
    const newSchedule = await service.create(validatedData);
    return res.status(201).json(newSchedule);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validacion fallida',
        details: error.issues,
      });
    }
    res.status(404).json({ error: getErrorMessage(error) });
  }
});

classScheduleRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = ClassScheduleIdSchema.parse({ id: req.params.id });
    const validatedData = UpdateClassScheduleSchema.parse(req.body);
    const updatedSchedule = await service.update(validatedId.id, validatedData);
    return res.status(200).json(updatedSchedule);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validacion fallida',
        details: error.issues,
      });
    }
    res.status(404).json({ error: getErrorMessage(error) });
  }
});

//DELETE /api/classSchedules/:id
classScheduleRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = ClassScheduleIdSchema.parse({ id: req.params.id });
    const deleted = await service.delete(validatedId.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ message: 'Horario de clase no encontrado' });
    }
    return res.status(204).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Id invalido',
        details: error.issues,
      });
    }
    return res
      .status(500)
      .json({ message: 'Error al eliminar el horario de clase' });
  }
});
