import { Router, Request, Response } from 'express';
import { instructorRepository } from '../shared/instances.js';
import { InstructorService } from './instructor.service.js';
import {
  InstructorIdSchema,
  CreateInstructorSchema,
  UpdateInstructorSchema,
} from './instructor.schemas.js';
import { handleError } from '../utils/errorHandler.js';

export const instructorRouter = Router();

const service = new InstructorService(instructorRepository);

// GET /api/instructors
instructorRouter.get('/', async (req: Request, res: Response) => {
  try {
    const instructors = await service.getAllInstructors();
    res.status(200).json(instructors);
  } catch (error) {
    handleError(error, res);
  }
});

// GET /api/instructors/:id

instructorRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = InstructorIdSchema.parse({ id: req.params.id });
    const instructor = await service.getInstructorById(validatedId.id);
    return res.status(200).json(instructor);
  } catch (error) {
    handleError(error, res);
  }
});

//POST /api/instructors - Crear nuevo instructor

instructorRouter.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = CreateInstructorSchema.parse(req.body);
    const newInstructor = await service.add(validatedData);
    res.status(201).json(newInstructor);
  } catch (error) {
    handleError(error, res);
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
    handleError(error, res);
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
    handleError(error, res);
  }
});
