import { Router } from 'express';
import { findAll, findOne, create, update, remove } from './payment.controller.js';
import {
  CreatePaymentSchema,
  GetPaymentByIdRequestSchema,
  UpdatePaymentSchema,
  DeletePaymentRequestSchema,
  PaymentQuerySchema,
} from './payment.schemas.js';
import { validate } from '../../middlewares/validate.middleware.js';

export const paymentRouter = Router();

paymentRouter.get('/', validate(PaymentQuerySchema), findAll);
paymentRouter.get('/:id', validate(GetPaymentByIdRequestSchema), findOne);
paymentRouter.post('/', validate(CreatePaymentSchema), create);
paymentRouter.patch('/:id', validate(UpdatePaymentSchema), update);
paymentRouter.delete('/:id', validate(DeletePaymentRequestSchema), remove);

export const membershipPaymentRouter = Router({ mergeParams: true });

membershipPaymentRouter.get('/', findAll);
membershipPaymentRouter.post('/', validate(CreatePaymentSchema), create);
