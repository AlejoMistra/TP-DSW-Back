import { Router, Request, Response } from 'express';
import {
  classScheduleRepository,
  instructorRepository,
} from '../../shared/instances.js';
import { ClassScheduleService } from './classSchedule.service.js';
import {
  ClassScheduleIdSchema,
  ClassScheduleCategorySchema,
  CreateClassScheduleSchema,
  UpdateClassScheduleSchema,
  DayOfWeekSchema,
} from './classSchedule.schemas.js';
import { handleError } from '../../utils/errorHandler.js';

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
    handleError(error, res);
  }
});

// GET /api/classSchedules/:id
classScheduleRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = ClassScheduleIdSchema.parse({ id: req.params.id });
    const schedule = await service.getById(validatedId.id);
    return res.status(200).json(schedule);
  } catch (error) {
    handleError(error, res);
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
      handleError(error, res);
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
      handleError(error, res);
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
      handleError(error, res);
    }
  },
);

classScheduleRouter.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = CreateClassScheduleSchema.parse(req.body);
    const newSchedule = await service.add(validatedData);
    return res.status(201).json(newSchedule);
  } catch (error) {
    handleError(error, res);
  }
});

classScheduleRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = ClassScheduleIdSchema.parse({ id: req.params.id });
    const validatedData = UpdateClassScheduleSchema.parse(req.body);
    const updatedSchedule = await service.update(validatedId.id, validatedData);
    return res.status(200).json(updatedSchedule);
  } catch (error) {
    handleError(error, res);
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
    handleError(error, res);
  }
});
