import { Router, Request, Response } from 'express';
import { membershipPlanRepository } from '../../shared/instances.js';
import { MembershipPlanService } from './membershipPlan.service.js';
import {
  CreateMembershipPlanSchema,
  GetMembershipPlanByIdRequestSchema,
  UpdateMembershipPlanSchema,
  DeleteMembershipPlanRequestSchema,
  type CreateMembershipPlanInput,
  type UpdateMembershipPlanInput,
} from './membershipPlan.schemas.js';
import { validate } from '../../middlewares/validate.middleware.js';

export const membershipPlanController = Router();
const service = new MembershipPlanService(membershipPlanRepository);

// GET /api/membership-plans
membershipPlanController.get('/', async (req: Request, res: Response) => {
  const plans = await service.getAllPlans();
  res.status(200).json(plans);
});

// GET /api/membership-plans/:id
membershipPlanController.get('/:id', validate(GetMembershipPlanByIdRequestSchema), async (req, res) => {
  const { id } = req.validated!.params as { id: number };
  const plan = await service.getPlanById(id);
  res.status(200).json(plan);
});

// POST /api/membership-plans - Crear nuevo plan de membresía
membershipPlanController.post('/', validate(CreateMembershipPlanSchema), async (req, res) => {
  const { body } = req.validated!;
  const newPlan = await service.createPlan(body as CreateMembershipPlanInput);
  res.status(201).json(newPlan);
});

// PUT /api/membership-plans/:id - Actualizar plan de membresía existente
membershipPlanController.patch('/:id', validate(UpdateMembershipPlanSchema), async (req, res) => {
  const { id } = req.validated!.params as { id: number };
  const newPlan = await service.updatePlan(id, req.validated!.body as UpdateMembershipPlanInput);
  res.status(200).json(newPlan);
});

// DELETE /api/membership-plans/:id - Eliminar plan de membresía existente
membershipPlanController.delete('/:id', validate(DeleteMembershipPlanRequestSchema), async (req, res) => {
  const { id } = req.validated!.params as { id: number };
  await service.deletePlan(id);
  res.status(204).send();
});
