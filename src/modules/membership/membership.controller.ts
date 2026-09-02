import type { Request, Response } from 'express';
import { membershipService } from '../../shared/instances.js';
import type {
  CreateMembershipInput,
  UpdateMembershipInput,
} from './membership.schemas.js';

export const findAll = async (_req: Request, res: Response) => {
  const memberships = await membershipService.getAll();
  res.status(200).json(memberships);
};

export const findOne = async (req: Request, res: Response) => {
  const { id } = req.params;
  const membership = await membershipService.getById(Number(id));
  res.status(200).json(membership);
};

export const findByMemberId = async (req: Request, res: Response) => {
  const { memberId } = req.params;
  const membership = await membershipService.getByMemberId(Number(memberId));
  res.status(200).json(membership);
};

export const create = async (req: Request, res: Response) => {
  const { body } = req.validated!;
  const membership = await membershipService.create(body as CreateMembershipInput);
  res.status(201).json(membership);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req.validated!;
  const membership = await membershipService.update(
    Number(id),
    body as UpdateMembershipInput,
  );
  res.status(200).json(membership);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await membershipService.delete(Number(id));
  res.status(204).send();
};