import { Router } from 'express';
import { findAll, findOne, create, update, remove } from './exercise.controller.js';
import {
  CreateExerciseSchema,
  GetExerciseByIdRequestSchema,
  UpdateExerciseSchema,
  DeleteExerciseRequestSchema,
} from './exercise.schemas.js';
import { validate } from '../../middlewares/validate.middleware.js';

export const exerciseRouter = Router();

exerciseRouter.get('/', findAll);
exerciseRouter.get('/:id', validate(GetExerciseByIdRequestSchema), findOne);
exerciseRouter.post('/', validate(CreateExerciseSchema), create);
exerciseRouter.patch('/:id', validate(UpdateExerciseSchema), update);
exerciseRouter.delete('/:id', validate(DeleteExerciseRequestSchema), remove);