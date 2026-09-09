import type { Request, Response } from 'express';
import { ClassScheduleService } from './classSchedule.service.js';
import type { CreateClassScheduleInput, UpdateClassScheduleInput } from './classSchedule.schemas.js';

export class ClassScheduleController {
  constructor(private readonly service: ClassScheduleService) {}

  getAll = async (_req: Request, res: Response) => {
    const items = await this.service.getAll();
    res.status(200).json(items);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.validated!.params as { id: number };
    const item = await this.service.getById(id);
    res.status(200).json(item);
  };

  getByCategory = async (req: Request, res: Response) => {
    const { category } = req.validated!.params as { category: any };
    const items = await this.service.getByCategory(category);
    res.status(200).json(items);
  };

  create = async (req: Request, res: Response) => {
    const { body } = req.validated!;
    const created = await this.service.create(body as CreateClassScheduleInput);
    res.status(201).json(created);
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.validated!.params as { id: number };
    const { body } = req.validated!;
    const updated = await this.service.update(id, body as UpdateClassScheduleInput);
    res.status(200).json(updated);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.validated!.params as { id: number };
    await this.service.delete(id);
    res.status(204).send();
  };
}
