import { Router } from 'express';
import { instructorController } from '../../shared/instances.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  CreateInstructorSchema,
  DeleteInstructorRequestSchema,
  GetInstructorByIdRequestSchema,
  UpdateInstructorSchema,
} from './instructor.schemas.js';

export const instructorRouter = Router();

instructorRouter.get(
  '/',
  instructorController.getAll,
);

instructorRouter.get(
  '/:id',
  validate(GetInstructorByIdRequestSchema),
  instructorController.getById,
);

instructorRouter.post(
  '/',
  validate(CreateInstructorSchema),
  instructorController.create,
);

instructorRouter.patch(
  '/:id',
  validate(UpdateInstructorSchema),
  instructorController.update,
);

instructorRouter.delete(
  '/:id',
  validate(DeleteInstructorRequestSchema),
  instructorController.delete,
);

// Compatibilidad temporal con clientes que todavía usan PUT.
instructorRouter.put(
  '/:id',
  validate(UpdateInstructorSchema),
  instructorController.update,
);