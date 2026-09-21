import type { Request, Response } from "express";
import { userService } from '../../shared/instances.js';
import type { CreateUserInput, UpdateUserInput } from './user.schemas.js';

export const findAll = async (req: Request, res: Response) => {
  const users = await userService.getAll();
  res.status(200).json(users);
};

export const findOne = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.getById(Number(id));
  res.status(200).json(user);
};

export const create = async (req: Request, res: Response) => {
  const { body } = req.validated!;
  const newUser = await userService.create(body as CreateUserInput);
  res.status(201).json(newUser);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req.validated!;
  const updatedUser = await userService.update(Number(id), body as UpdateUserInput);
  res.status(200).json(updatedUser);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await userService.delete(Number(id));
  res.status(204).send();
};