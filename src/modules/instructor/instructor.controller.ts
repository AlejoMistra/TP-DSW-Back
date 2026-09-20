import type { Request, Response } from 'express';
import type {
  CreateInstructorInput,
  UpdateInstructorInput,
} from './instructor.schemas.js';
import { InstructorService } from './instructor.service.js';

export class InstructorController {
  constructor(
    private readonly service: InstructorService,
  ) {}

  getAll = async (_req: Request, res: Response) => {
    const instructors = await this.service.getAll();

    res.status(200).json(instructors);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.validated!.params as { id: number };

    const instructor = await this.service.getById(id);

    res.status(200).json(instructor);
  };

  create = async (req: Request, res: Response) => {
    const { body } = req.validated!;

    const instructor = await this.service.create(
      body as CreateInstructorInput,
    );

    res.status(201).json(instructor);
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.validated!.params as { id: number };
    const { body } = req.validated!;

    const instructor = await this.service.update(
      id,
      body as UpdateInstructorInput,
    );

    res.status(200).json(instructor);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.validated!.params as { id: number };

    await this.service.delete(id);

    res.status(204).send();
  };
}