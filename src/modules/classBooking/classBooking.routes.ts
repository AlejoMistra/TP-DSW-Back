import { Router } from 'express';
import { classBookingController } from '../../shared/instances.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/authentication.middleware.js';
import { authorize } from '../../middlewares/authorization.middleware.js';
import { UserRole } from '../../generated/prisma/enums.js';
import {
  CreateClassBookingSchema,
  GetClassBookingByIdRequestSchema,
  UpdateClassBookingSchema,
  DeleteClassBookingRequestSchema,
} from './classBooking.schemas.js';

export const classBookingRouter = Router();

classBookingRouter.use(authenticate);

classBookingRouter.get('/', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR), classBookingController.getAll);
classBookingRouter.get('/:id', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.MEMBER), validate(GetClassBookingByIdRequestSchema), classBookingController.getById);
classBookingRouter.post('/', authorize(UserRole.ADMIN, UserRole.MEMBER), validate(CreateClassBookingSchema), classBookingController.create);
classBookingRouter.patch('/:id', authorize(UserRole.ADMIN, UserRole.MEMBER), validate(UpdateClassBookingSchema), classBookingController.update);
classBookingRouter.put('/:id', authorize(UserRole.ADMIN, UserRole.MEMBER), validate(UpdateClassBookingSchema), classBookingController.update);
classBookingRouter.delete('/:id', authorize(UserRole.ADMIN, UserRole.MEMBER), validate(DeleteClassBookingRequestSchema), classBookingController.delete);