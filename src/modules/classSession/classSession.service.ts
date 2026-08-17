import {
  ClassSessionResponseSchema,
  type ClassSessionResponse,
  type CreateClassSessionInput,
  type UpdateClassSessionInput,
} from './classSession.schema.js';
import { ClassSessionRepository } from './classSession.repository.js';
import { ClassSession } from '../../generated/prisma/client.js';
import { ClassScheduleRepository } from '../classSchedule/classSchedule.repository.js';

export class ClassSessionService {
  constructor(
    private readonly repository: ClassSessionRepository,
    private readonly classScheduleRepository: ClassScheduleRepository,
  ) {}

  async getAll(): Promise<ClassSessionResponse[]> {
    const sessions = await this.repository.getAll();
    return sessions.map((s) => this.toResponse(s));
  }

  async getById(id: number): Promise<ClassSessionResponse> {
    const session = await this.repository.getById(id);
    if (!session) throw new Error(`Sesion de clase con ID ${id} no encontrada`);
    return this.toResponse(session);
  }

async create(input: CreateClassSessionInput): Promise<ClassSessionResponse> {
  const schedule = await this.classScheduleRepository.getById(input.classScheduleId);
  if (!schedule) throw new Error(`ClassSchedule con ID ${input.classScheduleId} no encontrado`);

  const session = await this.repository.create({
    classScheduleId: input.classScheduleId,
    date: input.date,
    startTime: input.startTime,
    endTime: input.endTime,
    status: input.status,
    remainingCapacity: schedule.maxCapacity,
  });

  return this.toResponse(session);
}

  async update(id: number, input: UpdateClassSessionInput): Promise<ClassSessionResponse> {
    const existing = await this.repository.getById(id);
    if (!existing) throw new Error(`Sesion de clase con ID ${id} no encontrada`);

    if (input.classScheduleId !== undefined) {
      const schedule = await this.classScheduleRepository.getById(input.classScheduleId);
      if (!schedule) throw new Error(`ClassSchedule con ID ${input.classScheduleId} no encontrado`);
    }

    const updated = await this.repository.update(id, input);
    return this.toResponse(updated);
  }
  
  async delete(id: number): Promise<void> {
    const existing = await this.repository.getById(id);
    if (!existing) throw new Error(`Sesion de clase con ID ${id} no encontrada`);
    await this.repository.delete(id);
  }

  private toResponse(session: ClassSession): ClassSessionResponse {
    return ClassSessionResponseSchema.parse({
      id: session.id,
      classScheduleId: session.classScheduleId,
      date: session.date.toISOString(),
      startTime: session.startTime,
      endTime: session.endTime,
      remainingCapacity: session.remainingCapacity,
      status: session.status,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      deletedAt: session.deletedAt,
    });
  }
}  