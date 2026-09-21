import type { Request, Response } from 'express';
import { ClassSessionService } from './classSession.service.js';
import type { CreateClassSessionInput, UpdateClassSessionInput } from './classSession.schemas.js';

export class ClassSessionController {
  constructor(private readonly service: ClassSessionService) {}

  getAll = async (_req: Request, res: Response) => {
    const items = await this.service.getAll();
    res.status(200).json(items);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.validated!.params as { id: number };
    const item = await this.service.getById(id);
    res.status(200).json(item);
  };

  getByInstructor = async (req: Request, res: Response) => {
    const { instructorId } = req.validated!.params as { instructorId: number };
    const items = await this.service.getByInstructor(instructorId);
    res.status(200).json(items);
  };

  getBySchedule = async (req: Request, res: Response) => {
    const { classScheduleId } = req.validated!.params as { classScheduleId: number };
    const items = await this.service.getBySchedule(classScheduleId);
    res.status(200).json(items);
  };

  create = async (req: Request, res: Response) => {
    const { body } = req.validated!;
    const created = await this.service.create(body as CreateClassSessionInput);
    res.status(201).json(created);
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.validated!.params as { id: number };
    const { body } = req.validated!;
    const updated = await this.service.update(id, body as UpdateClassSessionInput);
    res.status(200).json(updated);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.validated!.params as { id: number };
    await this.service.delete(id);
    res.status(204).send();
  };
}
