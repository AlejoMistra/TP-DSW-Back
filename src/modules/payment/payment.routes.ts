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
import { authenticate } from '../../middlewares/authentication.middleware.js';
import { authorize } from '../../middlewares/authorization.middleware.js';
import { UserRole } from '../../generated/prisma/enums.js';

export const paymentRouter = Router();

paymentRouter.use(authenticate);

paymentRouter.get('/', authorize(UserRole.ADMIN), validate(PaymentQuerySchema), findAll);
paymentRouter.get('/:id', authorize(UserRole.ADMIN, UserRole.MEMBER), validate(GetPaymentByIdRequestSchema), findOne);
paymentRouter.post('/', authorize(UserRole.ADMIN), validate(CreatePaymentSchema), create);
paymentRouter.patch('/:id', authorize(UserRole.ADMIN), validate(UpdatePaymentSchema), update);
paymentRouter.delete('/:id', authorize(UserRole.ADMIN), validate(DeletePaymentRequestSchema), remove);

export const membershipPaymentRouter = Router({ mergeParams: true });

membershipPaymentRouter.use(authenticate);

membershipPaymentRouter.get('/', authorize(UserRole.ADMIN, UserRole.MEMBER), findAll);
membershipPaymentRouter.post('/', authorize(UserRole.ADMIN), validate(CreatePaymentSchema), create);

