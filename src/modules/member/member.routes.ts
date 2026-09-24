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
import { authenticate } from '../../middlewares/authentication.middleware.js';
import { authorize } from '../../middlewares/authorization.middleware.js';
import { UserRole } from '../../generated/prisma/enums.js';

export const memberRouter = Router();

memberRouter.use(authenticate);

memberRouter.get('/', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR), findAll);
memberRouter.get('/with-membership', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR), findAllWithMembership);
memberRouter.get('/:id', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.MEMBER), validate(GetMemberByIdRequestSchema), findOne);
memberRouter.post('/', authorize(UserRole.ADMIN), validate(CreateMemberSchema), create);
memberRouter.patch('/:id', authorize(UserRole.ADMIN, UserRole.MEMBER), validate(UpdateMemberSchema), update);
memberRouter.delete('/:id', authorize(UserRole.ADMIN), validate(DeleteMemberRequestSchema), remove);


