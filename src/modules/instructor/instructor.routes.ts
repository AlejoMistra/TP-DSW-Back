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
} from './instructor.schemas.js';

export const instructorRouter = Router();

instructorRouter.use(authenticate);

instructorRouter.get(
  '/',
  authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.MEMBER),
  instructorController.getAll,
);

instructorRouter.get(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.MEMBER),
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

// Hay que actualizar a PATCH en el front, pero por ahora para que siga funcionando dejamos el put tambien
instructorRouter.put(
  '/:id',
  authorize(UserRole.ADMIN),
  validate(UpdateInstructorSchema),
  instructorController.update,
);