import { Router } from 'express';
import {
  findAll,
  findOne,
  findByRoutine,
  create,
  update,
  remove,
} from './routineExercise.controller.js';
import {
  CreateRoutineExerciseSchema,
  GetRoutineExerciseByIdRequestSchema,
  GetRoutineExercisesByRoutineRequestSchema,
  UpdateRoutineExerciseSchema,
  DeleteRoutineExerciseRequestSchema,
} from './routineExercise.schemas.js';
import { validate } from '../../middlewares/validate.middleware.js';

export const routineExerciseRouter = Router();

routineExerciseRouter.get('/', findAll);

routineExerciseRouter.get('/:id', validate(GetRoutineExerciseByIdRequestSchema), findOne);

// listar por rutina (anidado style) - /api/routine-exercises/routine/:routineId
routineExerciseRouter.get(
  '/routine/:routineId',
  validate(GetRoutineExercisesByRoutineRequestSchema),
  findByRoutine,
);

// crear (temporalmente sin middleware de role)
routineExerciseRouter.post('/', validate(CreateRoutineExerciseSchema), create);

// actualizar (temporalmente sin middleware)
routineExerciseRouter.patch('/:id', validate(UpdateRoutineExerciseSchema), update);

// borrar (temporalmente sin middleware)
routineExerciseRouter.delete('/:id', validate(DeleteRoutineExerciseRequestSchema), remove);