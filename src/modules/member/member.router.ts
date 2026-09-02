import { Router, Request, Response } from 'express';
import { memberRepository } from '../../shared/instances.js';
import { MemberService } from './member.service.js';
import {
  MemberIdSchema,
  CreateMemberSchema,
  UpdateMemberSchema,
} from './member.schemas.js';

import { handleError } from '../../utils/errorHandler.js';

export const memberRouter = Router();

const service = new MemberService(memberRepository);

//GET /api/members
// memberRouter.get('/', async (req: Request, res: Response) => {
//   try {
//     const members = await service.getAll();
//     res.status(200).json(members);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

memberRouter.get('/', async (req: Request, res: Response) => {
  try {
    const members = await service.getAll();
    res.status(200).json(members);
  } catch (error) {
    handleError(error, res);
  }
});

memberRouter.get('/with-membership', async (req: Request, res: Response) => {
  try {
    const members = await service.getAllWithMembership();
    res.status(200).json(members);
  } catch (error) {
    handleError(error, res);
  }
});

//GET /api/members/:id
memberRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = MemberIdSchema.parse({ id: req.params.id });
    const member = await service.getById(validatedId.id);
    res.status(200).json(member);
  } catch (error) {
    handleError(error, res);
  }
});

//POST /api/members
memberRouter.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = CreateMemberSchema.parse(req.body);
    const newMember = await service.create(validatedData);
    res.status(201).json(newMember);
  } catch (error) {
    handleError(error, res);
  }
});

//PUT /api/members/:id
memberRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = MemberIdSchema.parse({ id: req.params.id });
    const validatedData = UpdateMemberSchema.parse(req.body);
    const updatedMember = await service.update(validatedId.id, validatedData);
    res.status(200).json(updatedMember);
  } catch (error) {
    handleError(error, res);
  }
});

//DELETE /api/members/:id
memberRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = MemberIdSchema.parse({ id: req.params.id });
    await service.delete(validatedId.id);
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
});
