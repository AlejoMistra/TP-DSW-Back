import { Router, type Request, type Response } from 'express';
import { classBookingRepository } from '../../shared/instances.js';
import { ClassBookingService } from './classBooking.service.js';
import {
  CreateClassBookingSchema,
  ClassBookingIdSchema,
  UpdateClassBookingSchema,
} from './classBooking.schemas.js';
import { handleError } from '../../utils/errorHandler.js';

export const classBookingRouter = Router();
const service = new ClassBookingService(classBookingRepository);

classBookingRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const classBookings = await service.getAll();
    res.status(200).json(classBookings);
  } catch (error) {
    handleError(error, res);
  }
});

classBookingRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = ClassBookingIdSchema.parse({ id: req.params.id });
    const classBooking = await service.getById(validatedId.id);
    res.status(200).json(classBooking);
  } catch (error) {
    handleError(error, res);
  }
});

classBookingRouter.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = CreateClassBookingSchema.parse(req.body);
    const newClassBooking = await service.create(validatedData);
    res.status(201).json(newClassBooking);
  } catch (error) {
    handleError(error, res);
  }
});

classBookingRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = ClassBookingIdSchema.parse({ id: req.params.id });
    const validatedData = UpdateClassBookingSchema.parse(req.body);
    const updatedClassBooking = await service.update(validatedId.id, validatedData);
    res.status(200).json(updatedClassBooking);
  } catch (error) {
    handleError(error, res);
  }
});

classBookingRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = ClassBookingIdSchema.parse({ id: req.params.id });
    await service.delete(validatedId.id);
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
});