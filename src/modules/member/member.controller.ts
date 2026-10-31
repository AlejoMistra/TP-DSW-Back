import type { Request, Response } from 'express';
import type { MembershipStatus } from '../../generated/prisma/client.js';
import { memberService } from '../../shared/instances.js';
import type {
  CreateMemberInput,
  UpdateMemberInput,
  UpdateMyProfileInput,
} from './member.schemas.js';

export const getMe = async (req: Request, res: Response) => {
  const member = await memberService.getMe(req.user!.userId);
  res.status(200).json(member);
};

export const updateMe = async (req: Request, res: Response) => {
  const { body } = req.validated!;
  const updatedMember = await memberService.updateMe(
    req.user!.userId,
    body as UpdateMyProfileInput,
  );
  res.status(200).json(updatedMember);
};

export const findAll = async (req: Request, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const members = await memberService.getAll(page, limit);
  res.status(200).json(members);
};

export const findAllWithMembership = async (req: Request, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const membershipStatus = req.query.membershipStatus as MembershipStatus | undefined;
  const members = await memberService.getAllWithMembership(
    page,
    limit,
    membershipStatus,
  );
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

export const reactivate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req.validated!;
  const reactivated = await memberService.reactivate(
    Number(id),
    body as CreateMemberInput,
  );
  res.status(200).json(reactivated);
};
