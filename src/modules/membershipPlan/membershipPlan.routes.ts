import { Router } from 'express';
import { findAll, findOne, create, update, remove } from './membershipPlan.controller.js';
import {
  CreateMembershipPlanSchema,
  GetMembershipPlanByIdRequestSchema,
  UpdateMembershipPlanSchema,
  DeleteMembershipPlanRequestSchema,
} from './membershipPlan.schemas.js';
import { validate } from '../../middlewares/validate.middleware.js';

export const membershipPlanRouter = Router();

membershipPlanRouter.get('/', findAll);
membershipPlanRouter.get('/:id', validate(GetMembershipPlanByIdRequestSchema), findOne);
membershipPlanRouter.post('/', validate(CreateMembershipPlanSchema), create);
membershipPlanRouter.patch('/:id', validate(UpdateMembershipPlanSchema), update);
membershipPlanRouter.delete('/:id', validate(DeleteMembershipPlanRequestSchema), remove);
