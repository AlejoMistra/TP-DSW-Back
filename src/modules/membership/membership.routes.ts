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

export const membershipRouter = Router();

membershipRouter.get('/', findAll);
membershipRouter.get('/member/:memberId', validate(GetMembershipByMemberIdRequestSchema), findByMemberId);
membershipRouter.get('/:id', validate(GetMembershipByIdRequestSchema), findOne);
membershipRouter.post('/', validate(CreateMembershipSchema), create);
membershipRouter.patch('/:id', validate(UpdateMembershipSchema), update);
membershipRouter.delete('/:id', validate(DeleteMembershipRequestSchema), remove);

membershipRouter.use('/:membershipId/payments', membershipPaymentRouter);