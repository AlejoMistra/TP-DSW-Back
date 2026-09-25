import { Router } from 'express';
import {
  CreateMembershipSchema,
  GetMembershipByIdRequestSchema,
  GetMembershipByMemberIdRequestSchema,
  UpdateMembershipSchema,
  DeleteMembershipRequestSchema,
} from './membership.schemas.js';
import { membershipPaymentRouter } from '../payment/payment.routes.js';
import {
  findAll,
  findOne,
  findByMemberId,
  create,
  update,
  remove,
} from './membership.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/authentication.middleware.js';
import { authorize } from '../../middlewares/authorization.middleware.js';
import { UserRole } from '../../generated/prisma/enums.js';

export const membershipRouter = Router();

membershipRouter.use(authenticate);

membershipRouter.get('/', authorize(UserRole.ADMIN), findAll);
membershipRouter.get('/member/:memberId', authorize(UserRole.ADMIN, UserRole.MEMBER), validate(GetMembershipByMemberIdRequestSchema), findByMemberId);
membershipRouter.get('/:id', authorize(UserRole.ADMIN, UserRole.MEMBER), validate(GetMembershipByIdRequestSchema), findOne);
membershipRouter.post('/', authorize(UserRole.ADMIN), validate(CreateMembershipSchema), create);
membershipRouter.patch('/:id', authorize(UserRole.ADMIN), validate(UpdateMembershipSchema), update);
membershipRouter.delete('/:id', authorize(UserRole.ADMIN), validate(DeleteMembershipRequestSchema), remove);

membershipRouter.use('/:membershipId/payments', membershipPaymentRouter);