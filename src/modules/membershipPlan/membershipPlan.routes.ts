import { Router } from 'express';
import { findAll, findOne, create, update, remove } from './membershipPlan.controller.js';
import {
  CreateMembershipPlanSchema,
  GetMembershipPlanByIdRequestSchema,
  UpdateMembershipPlanSchema,
  DeleteMembershipPlanRequestSchema,
} from './membershipPlan.schemas.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/authentication.middleware.js';
import { authorize } from '../../middlewares/authorization.middleware.js';
import { UserRole } from '../../generated/prisma/enums.js';

export const membershipPlanRouter = Router();

membershipPlanRouter.use(authenticate);

membershipPlanRouter.get('/', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.MEMBER), findAll);
membershipPlanRouter.get('/:id', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.MEMBER), validate(GetMembershipPlanByIdRequestSchema), findOne);
membershipPlanRouter.post('/', authorize(UserRole.ADMIN), validate(CreateMembershipPlanSchema), create);
membershipPlanRouter.patch('/:id', authorize(UserRole.ADMIN), validate(UpdateMembershipPlanSchema), update);
membershipPlanRouter.delete('/:id', authorize(UserRole.ADMIN), validate(DeleteMembershipPlanRequestSchema), remove);

