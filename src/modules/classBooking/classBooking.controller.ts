import type { Request, Response } from 'express';
import { ClassBookingService } from './classBooking.service.js';
import type { CreateClassBookingInput, UpdateClassBookingInput } from './classBooking.schemas.js';

export class ClassBookingController {
  constructor(private readonly service: ClassBookingService) {}

  getAll = async (req: Request, res: Response) => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const items = await this.service.getAll(page, limit);
    res.status(200).json(items);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.validated!.params as { id: number };
    const item = await this.service.getById(id);
    res.status(200).json(item);
  };

  create = async (req: Request, res: Response) => {
    const { body } = req.validated!;
    const created = await this.service.create(body as CreateClassBookingInput);
    res.status(201).json(created);
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.validated!.params as { id: number };
    const { body } = req.validated!;
    const updated = await this.service.update(id, body as UpdateClassBookingInput);
    res.status(200).json(updated);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.validated!.params as { id: number };
    await this.service.delete(id);
    res.status(204).send();
  };
}
