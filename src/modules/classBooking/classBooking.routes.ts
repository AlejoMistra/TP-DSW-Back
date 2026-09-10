import { Router } from 'express';
import { classBookingController } from '../../shared/instances.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  CreateClassBookingSchema,
  GetClassBookingByIdRequestSchema,
  UpdateClassBookingSchema,
  DeleteClassBookingRequestSchema,
} from './classBooking.schemas.js';

export const classBookingRouter = Router();

classBookingRouter.get('/', classBookingController.getAll);
classBookingRouter.get('/:id', validate(GetClassBookingByIdRequestSchema), classBookingController.getById);
classBookingRouter.post('/', validate(CreateClassBookingSchema), classBookingController.create);
classBookingRouter.patch('/:id', validate(UpdateClassBookingSchema), classBookingController.update);
classBookingRouter.put('/:id', validate(UpdateClassBookingSchema), classBookingController.update);
classBookingRouter.delete('/:id', validate(DeleteClassBookingRequestSchema), classBookingController.delete);