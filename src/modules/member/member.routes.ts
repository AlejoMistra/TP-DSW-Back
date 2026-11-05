import { Router } from 'express';
import {
  findAll,
  findAllWithMembership,
  findOne,
  create,
  update,
  remove,
  getMe,
  updateMe,
  reactivate,
} from './member.controller.js';
import {
  CreateMemberSchema,
  GetMemberByIdRequestSchema,
  UpdateMemberSchema,
  DeleteMemberRequestSchema,
  ListMembersSchema,
  UpdateMyProfileSchema,
  ReactivateMemberSchema,
} from './member.schemas.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/authentication.middleware.js';
import { authorize } from '../../middlewares/authorization.middleware.js';
import { UserRole } from '../../generated/prisma/enums.js';

export const memberRouter = Router();

memberRouter.use(authenticate);

memberRouter.get('/me', authorize(UserRole.MEMBER), getMe);
memberRouter.patch(
  '/me',
  authorize(UserRole.MEMBER),
  validate(UpdateMyProfileSchema),
  updateMe,
);
memberRouter.get(
  '/',
  authorize(UserRole.ADMIN, UserRole.INSTRUCTOR),
  validate(ListMembersSchema),
  findAll,
);
memberRouter.get(
  '/with-membership',
  authorize(UserRole.ADMIN, UserRole.INSTRUCTOR),
  validate(ListMembersSchema),
  findAllWithMembership,
);
memberRouter.get(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.INSTRUCTOR),
  validate(GetMemberByIdRequestSchema),
  findOne,
);
memberRouter.post(
  '/',
  authorize(UserRole.ADMIN),
  validate(CreateMemberSchema),
  create,
);
memberRouter.patch(
  '/:id',
  authorize(UserRole.ADMIN),
  validate(UpdateMemberSchema),
  update,
);
memberRouter.delete(
  '/:id',
  authorize(UserRole.ADMIN),
  validate(DeleteMemberRequestSchema),
  remove,
);
memberRouter.patch(
  '/:id/reactivate',
  authorize(UserRole.ADMIN),
  validate(ReactivateMemberSchema),
  reactivate,
);
