import { Router, type Request, type Response } from 'express';
import { membershipRepository } from '../../shared/instances.js';
import { MembershipService } from './membership.service.js';
import {
  CreateMembershipSchema,
  MembershipIdSchema,
  UpdateMembershipSchema,
} from './membership.schemas.js';
import { handleError } from '../../utils/errorHandler.js';

export const membershipRouter = Router();
const service = new MembershipService(membershipRepository);

membershipRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const memberships = await service.getAll();
    res.status(200).json(memberships);
  } catch (error) {
    handleError(error, res);
  }
});

membershipRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = MembershipIdSchema.parse({ id: req.params.id });
    const membership = await service.getById(validatedId.id);
    res.status(200).json(membership);
  } catch (error) {
    handleError(error, res);
  }
});

membershipRouter.get(
  '/member/:memberId',
  async (req: Request, res: Response) => {
    try {
      const validatedMemberId = MembershipIdSchema.parse({
        id: req.params.memberId,
      });
      const membership = await service.getByMemberId(validatedMemberId.id);
      res.status(200).json(membership);
    } catch (error) {
      handleError(error, res);
    }
  },
);

membershipRouter.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = CreateMembershipSchema.parse(req.body);
    const newMembership = await service.create(validatedData);
    res.status(201).json(newMembership);
  } catch (error) {
    handleError(error, res);
  }
});

membershipRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = MembershipIdSchema.parse({ id: req.params.id });
    const validatedData = UpdateMembershipSchema.parse(req.body);
    const updatedMembership = await service.update(
      validatedId.id,
      validatedData,
    );
    res.status(200).json(updatedMembership);
  } catch (error) {
    handleError(error, res);
  }
});

membershipRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = MembershipIdSchema.parse({ id: req.params.id });
    await service.delete(validatedId.id);
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
});
