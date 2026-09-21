import { Router } from "express";
import { create, findAll, findOne, remove, update } from './user.controller.js';
import { CreateUserSchema, UpdateUserSchema, DeleteUserSchema } from './user.schemas.js';
import { validate } from '../../middlewares/validate.middleware.js';

export const userRouter = Router();

userRouter.get('/', findAll);
userRouter.get('/:id', findOne);
userRouter.post('/', validate(CreateUserSchema), create);
userRouter.patch('/:id', validate(UpdateUserSchema), update);
userRouter.delete('/:id', validate(DeleteUserSchema), remove);
