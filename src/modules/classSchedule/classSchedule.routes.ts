import { Router } from 'express';
import { classScheduleController } from '../../shared/instances.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  CreateClassScheduleSchema,
  GetClassScheduleByIdRequestSchema,
  UpdateClassScheduleSchema,
  GetClassScheduleByCategoryRequestSchema,
  DeleteClassScheduleRequestSchema
} from './classSchedule.schemas.js';

export const classScheduleRouter = Router();

classScheduleRouter.get('/', classScheduleController.getAll);
classScheduleRouter.get('/:id', validate(GetClassScheduleByIdRequestSchema), classScheduleController.getById);
classScheduleRouter.get('/category/:category', validate(GetClassScheduleByCategoryRequestSchema), classScheduleController.getByCategory);
classScheduleRouter.post('/', validate(CreateClassScheduleSchema), classScheduleController.create);
classScheduleRouter.put('/:id', validate(UpdateClassScheduleSchema), classScheduleController.update);
classScheduleRouter.delete('/:id', validate(DeleteClassScheduleRequestSchema), classScheduleController.delete);