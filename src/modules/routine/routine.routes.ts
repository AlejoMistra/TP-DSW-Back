import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/authentication.middleware.js';
import { authorize } from '../../middlewares/authorization.middleware.js';
import { UserRole } from '../../generated/prisma/enums.js';
import {
  CreateRoutineSchema,
  UpdateRoutineSchema,
  GetRoutineByIdSchema,
  ListRoutinesSchema,
} from './routine.schemas.js';
import { findAll, findOne, create, update, remove } from './routine.controller.js';

export const routineRouter = Router();

routineRouter.use(authenticate);

routineRouter.get('/', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.MEMBER), validate(ListRoutinesSchema), findAll);
routineRouter.get('/:id', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.MEMBER), validate(GetRoutineByIdSchema), findOne);
routineRouter.post('/', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR), validate(CreateRoutineSchema), create);
routineRouter.patch('/:id', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR), validate(UpdateRoutineSchema), update);
routineRouter.delete('/:id', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR), remove);