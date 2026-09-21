import type { ClassSchedule } from '../../generated/prisma/client.js';
import {
  ClassScheduleResponseSchema,
  type ClassScheduleResponse,
  type CreateClassScheduleInput,
  type UpdateClassScheduleInput,
} from './classSchedule.schemas.js';
import { ClassScheduleRepository } from './classSchedule.repository.js';
import { ClassCategory } from '../../generated/prisma/client.js';
import { NotFoundError } from '../../utils/errors.js';

export class ClassScheduleService {
  constructor(
    private readonly classScheduleRepository: ClassScheduleRepository,
  ) {}

  async getAll(): Promise<ClassScheduleResponse[]> {
    const classes = await this.classScheduleRepository.getAll();
    return classes.map((c) => this.toResponse(c));
  }

  async getById(id: number): Promise<ClassScheduleResponse> {
    const classById = await this.classScheduleRepository.getById(id);
    if (!classById) throw new NotFoundError(`Tipo de clase con ID ${id} no encontrado`);
    return this.toResponse(classById);
  }

  async getByCategory(category: ClassCategory): Promise<ClassScheduleResponse[]> {
    const classes = await this.classScheduleRepository.getByCategory(category);
    return classes.map((c) => this.toResponse(c));
  }

  async create(input: CreateClassScheduleInput): Promise<ClassScheduleResponse> {
    const created = await this.classScheduleRepository.create(input);
    return this.toResponse(created);
  }

  async update(
    id: number,
    input: UpdateClassScheduleInput,
  ): Promise<ClassScheduleResponse> {
    const existing = await this.classScheduleRepository.getById(id);
    if (!existing) throw new NotFoundError(`Tipo de clase con ID ${id} no encontrado`);

    const updated = await this.classScheduleRepository.update(id, input);
    return this.toResponse(updated);
  }

  async delete(id: number): Promise<void> {
    const existing = await this.classScheduleRepository.getById(id);
    if (!existing) throw new NotFoundError(`Tipo de clase con ID ${id} no encontrado`);

    await this.classScheduleRepository.delete(id);
  }

  private toResponse(classSchedule: ClassSchedule): ClassScheduleResponse {
    return ClassScheduleResponseSchema.parse({
      id: classSchedule.id,
      name: classSchedule.name,
      description: classSchedule.description,
      category: classSchedule.category,
      maxCapacity: classSchedule.maxCapacity,
      durationMinutes: classSchedule.durationMinutes,
      createdAt: classSchedule.createdAt,
      updatedAt: classSchedule.updatedAt,
      deletedAt: classSchedule.deletedAt,
    });
  }
}