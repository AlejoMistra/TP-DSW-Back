import type { Request, Response } from 'express';
import { ClassSessionService } from './classSession.service.js';
import type {
  CreateClassSessionInput,
  UpdateClassSessionInput,
  RecurrenceScope,
} from './classSession.schemas.js';

export class ClassSessionController {
  constructor(private readonly service: ClassSessionService) {}

  getAll = async (req: Request, res: Response) => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 500;
    const items = await this.service.getAll(page, limit);
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
    const { classScheduleId } = req.validated!.params as {
      classScheduleId: number;
    };
    const items = await this.service.getBySchedule(classScheduleId);
    res.status(200).json(items);
  };

  create = async (req: Request, res: Response) => {
    const { body } = req.validated!;
    const created = await this.service.create(body as CreateClassSessionInput);
    res.status(201).json(created);
  };

  getAffectedBookings = async (req: Request, res: Response) => {
    const { id } = req.validated!.params as { id: number };
    const { scope } = (req.validated?.query || {}) as {
      scope?: RecurrenceScope;
    };
    const result = await this.service.getAffectedBookings(id, scope || 'this');
    res.status(200).json(result);
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.validated!.params as { id: number };
    const { body } = req.validated!;
    const updated = await this.service.update(
      id,
      body as UpdateClassSessionInput,
    );
    res.status(200).json(updated);
  };

  cancel = async (req: Request, res: Response) => {
    const params = (req.validated?.params || req.params) as {
      id: number | string;
    };
    const id = Number(params.id);
    const body = (req.validated?.body || req.body) as {
      scope?: RecurrenceScope;
    };
    const scope = body?.scope || 'this';
    await this.service.cancel(id, scope);
    res.status(200).json({ message: 'Sesión(es) cancelada(s) correctamente' });
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.validated!.params as { id: number };
    const scope =
      ((req.validated?.query as any)?.scope as RecurrenceScope) ||
      (req.query.scope as RecurrenceScope) ||
      'this';
    await this.service.delete(id, scope);
    res.status(204).send();
  };
}
