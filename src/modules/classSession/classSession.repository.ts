import { prisma } from '../../lib/prisma.js';
import type { ClassSession } from '../../generated/prisma/client.js';
import type {
  CreateClassSessionInput,
  UpdateClassSessionInput,
} from './classSession.schema.js';

  type CreateClassSessionData = {
    classScheduleId: number;
    date: Date;
    startTime: string;
    endTime: string;
    status?: 'SCHEDULED' | 'CANCELLED';
    remainingCapacity: number;
  };

export class ClassSessionRepository {
  async getAll(): Promise<ClassSession[]> {
    return prisma.classSession.findMany({
      where: { deletedAt: null },
    });
  }

  async getById(id: number): Promise<ClassSession | null> {
    return prisma.classSession.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async create(input: CreateClassSessionData): Promise<ClassSession> {
    return prisma.classSession.create({
      data: {
        classSchedule: { connect: { id: input.classScheduleId } },
        date: input.date,
        startTime: input.startTime,
        endTime: input.endTime,
        remainingCapacity: input.remainingCapacity,
        status: input.status ?? 'SCHEDULED',
      },
    });
  }

  async update(id: number, input: UpdateClassSessionInput): Promise<ClassSession> {
    return prisma.classSession.update({
      where: { id },
      data: {
        classSchedule:
          input.classScheduleId !== undefined
            ? { connect: { id: input.classScheduleId } }
            : undefined,
        date: input.date,
        startTime: input.startTime,
        endTime: input.endTime,
        remainingCapacity: input.remainingCapacity,
        status: input.status,
      },
    });
  }

  async delete(id: number): Promise<ClassSession> {
    return prisma.classSession.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}