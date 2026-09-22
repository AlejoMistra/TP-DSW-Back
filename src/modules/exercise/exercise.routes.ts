import { Router } from 'express';
import { findAll, findOne, create, update, remove } from './exercise.controller.js';
import {
  CreateExerciseSchema,
  GetExerciseByIdRequestSchema,
  UpdateExerciseSchema,
  DeleteExerciseRequestSchema,
} from './exercise.schemas.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/authentication.middleware.js';
import { authorize } from '../../middlewares/authorization.middleware.js';
import { UserRole } from '../../generated/prisma/enums.js';

export const exerciseRouter = Router();

exerciseRouter.use(authenticate);

exerciseRouter.get('/', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.MEMBER), findAll);
exerciseRouter.get('/:id', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.MEMBER), validate(GetExerciseByIdRequestSchema), findOne);
exerciseRouter.post('/', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR), validate(CreateExerciseSchema), create);
exerciseRouter.patch('/:id', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR), validate(UpdateExerciseSchema), update);
exerciseRouter.delete('/:id', authorize(UserRole.ADMIN), validate(DeleteExerciseRequestSchema), remove);