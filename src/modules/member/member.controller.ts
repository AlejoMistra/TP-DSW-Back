import type { Request, Response } from 'express';
import { memberService } from '../../shared/instances.js';
import type {
  CreateMemberInput,
  UpdateMemberInput,
} from './member.schemas.js';

export const findAll = async (req: Request, res: Response) => {
  const members = await memberService.getAll();
  res.status(200).json(members);
};

export const findAllWithMembership = async (req: Request, res: Response) => {
  const members = await memberService.getAllWithMembership();
  res.status(200).json(members);
};

export const findOne = async (req: Request, res: Response) => {
  const { id } = req.params;
  const member = await memberService.getById(Number(id));
  res.status(200).json(member);
};

export const create = async (req: Request, res: Response) => {
  const { body } = req.validated!;
  const newMember = await memberService.create(body as CreateMemberInput);
  res.status(201).json(newMember);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req.validated!;
  const updatedMember = await memberService.update(
    Number(id),
    body as UpdateMemberInput,
  );
  res.status(200).json(updatedMember);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await memberService.delete(Number(id));
  res.status(204).send();
};
