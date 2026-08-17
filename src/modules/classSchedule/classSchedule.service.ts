import type { ClassSchedule } from '../../generated/prisma/client.js';
import {
  ClassScheduleResponseSchema,
  type ClassScheduleResponse,
  type CreateClassScheduleInput,
  type UpdateClassScheduleInput,
} from './classSchedule.schemas.js';
import { ClassScheduleRepository } from './classSchedule.repository.js';
import { InstructorRepository } from '../instructor/instructor.repository.js';
import { ClassCategory } from '../../generated/prisma/client.js';

export class ClassScheduleService {
  constructor(
    private readonly classScheduleRepository: ClassScheduleRepository,
    private readonly instructorRepository: InstructorRepository,
  ) {}

  async getAll(): Promise<ClassScheduleResponse[]> {
    const classes = await this.classScheduleRepository.getAll();
    return classes.map((c) => this.toResponse(c));
  }

  async getById(id: number): Promise<ClassScheduleResponse> {
    const classById = await this.classScheduleRepository.getById(id);
    if (!classById) throw new Error(`ClassSchedule with ID ${id} not found`);
    return this.toResponse(classById);
  }

  async getByInstructor(instructorId: number): Promise<ClassScheduleResponse[]> {
    const instructor = await this.instructorRepository.getById(instructorId);
    if (!instructor) throw new Error(`Instructor with ID ${instructorId} not found`);

    const classes = await this.classScheduleRepository.getByInstructorId(instructorId);

    return classes.map((c) => this.toResponse(c));
  }

  async getByCategory(category: ClassCategory): Promise<ClassScheduleResponse[]> {
    const classes = await this.classScheduleRepository.getByCategory(category);
    return classes.map((c) => this.toResponse(c));
  }

  async create(input: CreateClassScheduleInput): Promise<ClassScheduleResponse> {
    const instructor = await this.instructorRepository.getById(input.instructorId);
    if (!instructor) throw new Error(`Instructor with ID ${input.instructorId} not found`);

    const created = await this.classScheduleRepository.create(input);
    return this.toResponse(created);
  }

  async update(
    id: number,
    input: UpdateClassScheduleInput,
  ): Promise<ClassScheduleResponse> {
    const existing = await this.classScheduleRepository.getById(id);
    if (!existing) throw new Error(`ClassSchedule with ID ${id} not found`);

    if (input.instructorId !== undefined) {
      const instructor = await this.instructorRepository.getById(input.instructorId);
      if (!instructor) throw new Error(`Instructor with ID ${input.instructorId} not found`);
    }

    const updated = await this.classScheduleRepository.update(id, input);
    return this.toResponse(updated);
  }

  async delete(id: number): Promise<void> {
    const existing = await this.classScheduleRepository.getById(id);
    if (!existing) throw new Error(`ClassSchedule with ID ${id} not found`);

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
      instructorId: classSchedule.instructorId,
      createdAt: classSchedule.createdAt,
      updatedAt: classSchedule.updatedAt,
      deletedAt: classSchedule.deletedAt,
    });
  }
}  