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
    const limit = req.query.limit ? Number(req.query.limit) : 10;
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
    const { classScheduleId } = req.validated!.params as { classScheduleId: number };
    const items = await this.service.getBySchedule(classScheduleId);
    res.status(200).json(items);
  };

  // Sin recurrence devuelve un objeto; con recurrence, un array con todas las sesiones generadas
  create = async (req: Request, res: Response) => {
    const { body } = req.validated!;
    const created = await this.service.create(body as CreateClassSessionInput);
    res.status(201).json(created);
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.validated!.params as { id: number };
    const { body, query } = req.validated!;
    const { scope, confirm } = query as { scope: RecurrenceScope; confirm: boolean };

    const updated = await this.service.updateWithScope(id, body as UpdateClassSessionInput, scope, confirm);

    // scope=THIS mantiene la respuesta actual (un objeto); all/following devuelven un array
    res.status(200).json(scope === 'THIS' ? updated[0] : updated);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.validated!.params as { id: number };
    const { scope, confirm } = req.validated!.query as { scope: RecurrenceScope; confirm: boolean };

    await this.service.deleteWithScope(id, scope, confirm);
    res.status(204).send();
  };
}