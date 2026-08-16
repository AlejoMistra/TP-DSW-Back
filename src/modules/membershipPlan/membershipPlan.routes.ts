import { Router } from 'express';
import { findAll, findOne, create, update, remove } from './membershipPlan.controller.js';
import {
  CreateMembershipPlanSchema,
  GetMembershipPlanByIdRequestSchema,
  UpdateMembershipPlanSchema,
  DeleteMembershipPlanRequestSchema,
} from './membershipPlan.schemas.js';
import { validate } from '../../middlewares/validate.middleware.js';

export const membershipPlanRoutes = Router();

membershipPlanRoutes.get('/', findAll);
membershipPlanRoutes.get('/:id', validate(GetMembershipPlanByIdRequestSchema), findOne);
membershipPlanRoutes.post('/', validate(CreateMembershipPlanSchema), create);
membershipPlanRoutes.patch('/:id', validate(UpdateMembershipPlanSchema), update);
membershipPlanRoutes.delete('/:id', validate(DeleteMembershipPlanRequestSchema), remove);
