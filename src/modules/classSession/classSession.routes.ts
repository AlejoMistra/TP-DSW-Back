import { Router } from 'express';
import { classSessionController } from '../../shared/instances.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  CreateClassSessionSchema,
  GetClassSessionByIdRequestSchema,
  GetClassSessionByInstructorRequestSchema,
  GetClassSessionByScheduleRequestSchema,
  UpdateClassSessionSchema,
  DeleteClassSessionRequestSchema,
} from './classSession.schemas.js';

export const classSessionRouter = Router();

classSessionRouter.get('/', classSessionController.getAll);
classSessionRouter.get('/:id', validate(GetClassSessionByIdRequestSchema), classSessionController.getById);
classSessionRouter.get('/instructor/:instructorId', validate(GetClassSessionByInstructorRequestSchema), classSessionController.getByInstructor);
classSessionRouter.get('/schedule/:classScheduleId', validate(GetClassSessionByScheduleRequestSchema), classSessionController.getBySchedule);
classSessionRouter.post('/', validate(CreateClassSessionSchema), classSessionController.create);
classSessionRouter.put('/:id', validate(UpdateClassSessionSchema), classSessionController.update);
classSessionRouter.delete('/:id', validate(DeleteClassSessionRequestSchema), classSessionController.delete);