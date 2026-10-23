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
  CancelClassSessionRequestSchema,
  CheckAffectedBookingsSchema,
  ListClassSessionsSchema,
} from './classSession.schemas.js';

export const classSessionRouter = Router();

classSessionRouter.use(authenticate);

// Lectura de clases: ADMIN, INSTRUCTOR y MEMBER
classSessionRouter.get(
  '/',
  authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.MEMBER),
  validate(ListClassSessionsSchema),
  classSessionController.getAll,
);

classSessionRouter.get(
  '/me',
  authorize(UserRole.INSTRUCTOR),
  classSessionController.getMine,
);

classSessionRouter.get(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.MEMBER),
  validate(GetClassSessionByIdRequestSchema),
  classSessionController.getById,
);
classSessionRouter.get(
  '/instructor/:instructorId',
  authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.MEMBER),
  validate(GetClassSessionByInstructorRequestSchema),
  classSessionController.getByInstructor,
);
classSessionRouter.get(
  '/schedule/:classScheduleId',
  authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.MEMBER),
  validate(GetClassSessionByScheduleRequestSchema),
  classSessionController.getBySchedule,
);

// Gestión de clases: SOLO ADMIN
classSessionRouter.get(
  '/:id/affected-bookings',
  authorize(UserRole.ADMIN),
  validate(CheckAffectedBookingsSchema),
  classSessionController.getAffectedBookings,
);
classSessionRouter.post(
  '/',
  authorize(UserRole.ADMIN),
  validate(CreateClassSessionSchema),
  classSessionController.create,
);
classSessionRouter.put(
  '/:id',
  authorize(UserRole.ADMIN),
  validate(UpdateClassSessionSchema),
  classSessionController.update,
);
classSessionRouter.patch(
  '/:id/cancel',
  authorize(UserRole.ADMIN),
  validate(CancelClassSessionRequestSchema),
  classSessionController.cancel,
);
classSessionRouter.delete(
  '/:id',
  authorize(UserRole.ADMIN),
  validate(DeleteClassSessionRequestSchema),
  classSessionController.delete,
);
