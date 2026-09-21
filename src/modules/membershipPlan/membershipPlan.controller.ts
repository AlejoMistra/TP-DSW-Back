import { Request, Response } from 'express';
import { membershipPlanRepository } from '../../shared/instances.js';
import { MembershipPlanService } from './membershipPlan.service.js';
import type {
  CreateMembershipPlanInput,  
  UpdateMembershipPlanInput,
} from './membershipPlan.schemas.js';

const service = new MembershipPlanService(membershipPlanRepository);

export const findAll = async (req: Request, res: Response) => {
  const plans = await service.findAll();
  res.status(200).json(plans);
}

export const findOne = async (req: Request, res: Response) => {
  const { id } = req.params;
  const plan = await service.findOne(Number(id));
  res.status(200).json(plan);
}

export const create = async (req: Request, res: Response) => {
  const { body } = req.validated!;
  const newPlan = await service.create(body as CreateMembershipPlanInput);
  res.status(201).json(newPlan);
}

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req.validated!;
  const updatedPlan = await service.update(Number(id), body as UpdateMembershipPlanInput);
  res.status(200).json(updatedPlan);
}

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await service.remove(Number(id));
  res.status(204).send();
}
