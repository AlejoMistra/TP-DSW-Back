import { Router } from 'express';
import { classSessionController } from '../../shared/instances.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/authentication.middleware.js';
import { authorize } from '../../middlewares/authorization.middleware.js';
import { UserRole } from '../../generated/prisma/enums.js';
import {
  CreateClassSessionSchema,
  GetClassSessionByIdRequestSchema,
  GetClassSessionByInstructorRequestSchema,
  GetClassSessionByScheduleRequestSchema,
  UpdateClassSessionSchema,
  DeleteClassSessionRequestSchema,
} from './classSession.schemas.js';

export const classSessionRouter = Router();

classSessionRouter.use(authenticate);

classSessionRouter.get('/', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.MEMBER), classSessionController.getAll);
classSessionRouter.get('/:id', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.MEMBER), validate(GetClassSessionByIdRequestSchema), classSessionController.getById);
classSessionRouter.get('/instructor/:instructorId', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.MEMBER), validate(GetClassSessionByInstructorRequestSchema), classSessionController.getByInstructor);
classSessionRouter.get('/schedule/:classScheduleId', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.MEMBER), validate(GetClassSessionByScheduleRequestSchema), classSessionController.getBySchedule);
classSessionRouter.post('/', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR), validate(CreateClassSessionSchema), classSessionController.create);
classSessionRouter.put('/:id', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR), validate(UpdateClassSessionSchema), classSessionController.update);
classSessionRouter.delete('/:id', authorize(UserRole.ADMIN), validate(DeleteClassSessionRequestSchema), classSessionController.delete);