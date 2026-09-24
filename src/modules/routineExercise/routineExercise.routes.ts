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
import { authenticate } from '../../middlewares/authentication.middleware.js';
import { authorize } from '../../middlewares/authorization.middleware.js';
import { UserRole } from '../../generated/prisma/enums.js';

export const routineExerciseRouter = Router();

routineExerciseRouter.use(authenticate);

routineExerciseRouter.get('/', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.MEMBER), findAll);

routineExerciseRouter.get('/:id', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.MEMBER), validate(GetRoutineExerciseByIdRequestSchema), findOne);

// listar por rutina (anidado style) - /api/routine-exercises/routine/:routineId
routineExerciseRouter.get(
  '/routine/:routineId',
  authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.MEMBER),
  validate(GetRoutineExercisesByRoutineRequestSchema),
  findByRoutine,
);

routineExerciseRouter.post('/', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR), validate(CreateRoutineExerciseSchema), create);

routineExerciseRouter.patch('/:id', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR), validate(UpdateRoutineExerciseSchema), update);

routineExerciseRouter.delete('/:id', authorize(UserRole.ADMIN, UserRole.INSTRUCTOR), validate(DeleteRoutineExerciseRequestSchema), remove);