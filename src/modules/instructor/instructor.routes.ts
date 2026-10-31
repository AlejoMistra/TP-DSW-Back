import { Router } from 'express';
import { instructorController } from '../../shared/instances.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/authentication.middleware.js';
import { authorize } from '../../middlewares/authorization.middleware.js';
import { UserRole } from '../../generated/prisma/enums.js';
import {
  CreateInstructorSchema,
  DeleteInstructorRequestSchema,
  GetInstructorByIdRequestSchema,
  UpdateInstructorSchema,
  ListInstructorsSchema,
  ReactivateInstructorSchema,
} from './instructor.schemas.js';

export const instructorRouter = Router();

instructorRouter.use(authenticate);

instructorRouter.get(
  '/',
  authorize(UserRole.ADMIN),
  validate(ListInstructorsSchema),
  instructorController.getAll,
);

instructorRouter.get(
  '/me',
  authorize(UserRole.INSTRUCTOR),
  instructorController.getMe,
);

instructorRouter.get(
  '/:id',
  authorize(UserRole.ADMIN),
  validate(GetInstructorByIdRequestSchema),
  instructorController.getById,
);

instructorRouter.post(
  '/',
  authorize(UserRole.ADMIN),
  validate(CreateInstructorSchema),
  instructorController.create,
);

instructorRouter.patch(
  '/:id',
  authorize(UserRole.ADMIN),
  validate(UpdateInstructorSchema),
  instructorController.update,
);

instructorRouter.delete(
  '/:id',
  authorize(UserRole.ADMIN),
  validate(DeleteInstructorRequestSchema),
  instructorController.delete,
);

instructorRouter.patch(
  '/:id/reactivate',
  authorize(UserRole.ADMIN),
  validate(ReactivateInstructorSchema),
  instructorController.reactivate,
);

// Hay que actualizar a PATCH en el front, pero por ahora para que siga funcionando dejamos el put tambien
instructorRouter.put(
  '/:id',
  authorize(UserRole.ADMIN),
  validate(UpdateInstructorSchema),
  instructorController.update,
);
