import { Router } from 'express';
import { classScheduleController } from '../../shared/instances.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/authentication.middleware.js';
import { authorize } from '../../middlewares/authorization.middleware.js';
import { UserRole } from '../../generated/prisma/enums.js';
import {
  CreateClassScheduleSchema,
  GetClassScheduleByIdRequestSchema,
  UpdateClassScheduleSchema,
  GetClassScheduleByCategoryRequestSchema,
  DeleteClassScheduleRequestSchema
} from './classSchedule.schemas.js';

export const classScheduleRouter = Router();

classScheduleRouter.use(authenticate);

classScheduleRouter.get('/', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.MEMBER), classScheduleController.getAll);
classScheduleRouter.get('/:id', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.MEMBER), validate(GetClassScheduleByIdRequestSchema), classScheduleController.getById);
classScheduleRouter.get('/category/:category', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.MEMBER), validate(GetClassScheduleByCategoryRequestSchema), classScheduleController.getByCategory);
classScheduleRouter.post('/', authorize(UserRole.ADMIN), validate(CreateClassScheduleSchema), classScheduleController.create);
classScheduleRouter.put('/:id', authorize(UserRole.ADMIN), validate(UpdateClassScheduleSchema), classScheduleController.update);
classScheduleRouter.delete('/:id', authorize(UserRole.ADMIN), validate(DeleteClassScheduleRequestSchema), classScheduleController.delete);