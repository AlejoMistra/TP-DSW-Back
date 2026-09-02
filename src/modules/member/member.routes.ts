import { Router } from 'express';
import {
  findAll,
  findAllWithMembership,
  findOne,
  create,
  update,
  remove,
} from './member.controller.js';
import {
  CreateMemberSchema,
  GetMemberByIdRequestSchema,
  UpdateMemberSchema,
  DeleteMemberRequestSchema,
} from './member.schemas.js';
import { validate } from '../../middlewares/validate.middleware.js';

export const memberRouter = Router();

memberRouter.get('/', findAll);
memberRouter.get('/with-membership', findAllWithMembership);
memberRouter.get('/:id', validate(GetMemberByIdRequestSchema), findOne);
memberRouter.post('/', validate(CreateMemberSchema), create);
memberRouter.put('/:id', validate(UpdateMemberSchema), update);
memberRouter.delete('/:id', validate(DeleteMemberRequestSchema), remove);

