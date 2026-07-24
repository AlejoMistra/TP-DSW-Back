import { Router, Request, Response } from 'express';
import { instructorRepository } from '../../shared/instances.js';
import { InstructorService } from './instructor.service.js';
import {
  InstructorIdSchema,
  CreateInstructorSchema,
  UpdateInstructorSchema,
} from './instructor.schemas.js';
import { z } from 'zod';
import { getErrorMessage } from '../../utils/errorHandler.js';

export const instructorRouter = Router();

const service = new InstructorService(instructorRepository);

// GET /api/instructors
instructorRouter.get('/', async (req: Request, res: Response) => {
  try {
    const instructors = await service.getAllInstructors();
    res.status(200).json(instructors);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los instructores' });
  }
});

// GET /api/instructors/:id

instructorRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = InstructorIdSchema.parse({ id: req.params.id });
    const instructor = await service.getInstructorById(validatedId.id);
    return res.status(200).json(instructor);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validacion fallida',
        details: error.issues,
      });
    }
    res.status(404).json({ message: getErrorMessage(error) });
  }
});

//POST /api/instructors - Crear nuevo instructor

instructorRouter.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = CreateInstructorSchema.parse(req.body);
    const newInstructor = await service.createInstructor(validatedData);
    res.status(201).json(newInstructor);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validacion fallida',
        details: error.issues,
      });
    }
    res.status(500).json({ message: 'Error al crear el instructor' });
  }
});

//PUT /api/instructors/:id - Actualizar instructor
instructorRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = InstructorIdSchema.parse({ id: req.params.id });
    const validatedData = UpdateInstructorSchema.parse(req.body);
    const updatedInstructor = await service.updateInstructor(
      validatedId.id,
      validatedData,
    );
    res.status(200).json(updatedInstructor);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validacion fallida',
        details: error.issues,
      });
    }
    res.status(404).json({ error: getErrorMessage(error) });
  }
});

//DELETE /api/instructors/:id - Eliminar instructor
instructorRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = InstructorIdSchema.parse({ id: req.params.id });
    const deleted = await service.deleteInstructor(validatedId.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Instructor no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validacion fallida',
        details: error.issues,
      });
    }
    res.status(500).json({ message: 'Error al eliminar el instructor' });
  }
});
