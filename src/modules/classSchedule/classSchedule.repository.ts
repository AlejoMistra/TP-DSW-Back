import { prisma } from '../../lib/prisma.js';
import type { ClassSchedule } from '../../generated/prisma/client.js';
import type {
  CreateClassScheduleInput,
  UpdateClassScheduleInput,
} from './classSchedule.schemas.js';

import { getPaginationParams } from '../../shared/pagination.js';

export class ClassScheduleRepository {
  async getAll(page?: number, limit?: number): Promise<ClassSchedule[]> {
    const { take, skip } = getPaginationParams(page, limit);
    return prisma.classSchedule.findMany({
      where: { deletedAt: null },
      take,
      skip,
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(): Promise<number> {
    return prisma.classSchedule.count({
      where: { deletedAt: null },
    });
  }

  async getById(id: number): Promise<ClassSchedule | null> {
    return prisma.classSchedule.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async create(input: CreateClassScheduleInput): Promise<ClassSchedule> {
    return prisma.classSchedule.create({
      data: {
        name: input.name,
        description: input.description ?? null,
        category: input.category,
        maxCapacity: input.maxCapacity,
        durationMinutes: input.durationMinutes,
      },
    });
  }

  async update(id: number, input: UpdateClassScheduleInput): Promise<ClassSchedule> {
    return prisma.classSchedule.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        category: input.category,
        maxCapacity: input.maxCapacity,
        durationMinutes: input.durationMinutes,
      },
    });
  }

  async delete(id: number): Promise<ClassSchedule> {
    return prisma.classSchedule.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async hasSessions(id: number): Promise<boolean> {
    const session = await prisma.classSession.findFirst({
      where: { classScheduleId: id, deletedAt: null },
      select: { id: true },
    });
    return session !== null;
  }

  async getByCategory(category: CreateClassScheduleInput['category']): Promise<ClassSchedule[]> {
    return prisma.classSchedule.findMany({
      where: { category, deletedAt: null },
    });
  }
}