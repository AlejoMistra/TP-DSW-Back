import { Router, Request, Response } from 'express';
import { GymClassRepository } from './gymClass.repository.js';
import { GymClassService } from './gymClass.service.js';
import {
  GymClassIdSchema,
  CreateGymClassSchema,
  UpdateGymClassSchema,
} from './gymClass.schemas.js';
import { z } from 'zod';

export const gymClassRouter = Router();
const repository = new GymClassRepository();
const service = new GymClassService(repository);

//GET /api/gymClasses
gymClassRouter.get('/', async (req: Request, res: Response) => {
  try {
    const gymClasses = await service.getAll();
    res.status(200).json(gymClasses);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al obtener las  clases de gimnasio' });
  }
});

// GET /api/gymClasses/:id
gymClassRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = GymClassIdSchema.parse({ id: req.params.id });
    const gymClass = await service.getById(validatedId.id);
    return res.status(200).json(gymClass);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Id invalido',
        details: error.issues,
      });
    }
    return res
      .status(500)
      .json({ message: 'Error al obtener la clase de gimnasio' });
  }
});
// GET /api/gymClasses/instructor/:instructorId
gymClassRouter.get(
  '/instructor/:instructorId',
  async (req: Request, res: Response) => {
    try {
      const validatedId = GymClassIdSchema.parse({
        id: req.params.instructorId,
      });
      const gymClasses = await service.getByInstructor(validatedId.id);
      return res.status(200).json(gymClasses);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Id invalido',
          details: error.issues,
        });
      }
      return res
        .status(500)
        .json({ message: 'Error al obtener las clases del instructor' });
    }
  },
);

gymClassRouter.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = CreateGymClassSchema.parse(req.body);
    const newGymClass = await service.create(validatedData);
    return res.status(201).json(newGymClass);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validacion fallida',
        details: error.issues,
      });
    }
    return res
      .status(500)
      .json({ message: 'Error al crear la clase de gimnasio' });
  }
});

gymClassRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = GymClassIdSchema.parse({ id: req.params.id });
    const validatedData = UpdateGymClassSchema.parse(req.body);
    const updatedGymClass = await service.update(validatedId.id, validatedData);
    if (!updatedGymClass) {
      return res
        .status(404)
        .json({ message: 'Clase de gimnasio no encontrada' });
    }
    return res.status(200).json(updatedGymClass);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validacion fallida',
        details: error.issues,
      });
    }
    return res
      .status(500)
      .json({ message: 'Error al actualizar la clase de gimnasio' });
  }
});

//DELETE /api/gymClasses/:id
gymClassRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = GymClassIdSchema.parse({ id: req.params.id });
    const deleted = await service.delete(validatedId.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ message: 'Clase de gimnasio no encontrada' });
    }
    return res.status(204).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Id invalido',
        details: error.issues,
      });
    }
    return res
      .status(500)
      .json({ message: 'Error al eliminar la clase de gimnasio' });
  }
});
