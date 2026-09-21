import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  CreateRoutineSchema,
  UpdateRoutineSchema,
  GetRoutineByIdSchema,
  ListRoutinesSchema,
} from './routine.schemas.js';
import { findAll, findOne, create, update, remove } from './routine.controller.js';

export const routineRouter = Router();

routineRouter.get('/', validate(ListRoutinesSchema), findAll);
routineRouter.get('/:id', validate(GetRoutineByIdSchema), findOne);
routineRouter.post('/', validate(CreateRoutineSchema), create);
routineRouter.patch('/:id', validate(UpdateRoutineSchema), update);
routineRouter.delete('/:id', remove);