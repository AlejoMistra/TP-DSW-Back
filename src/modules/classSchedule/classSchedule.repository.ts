import { prisma } from '../../lib/prisma.js';
import type { ClassSchedule } from '../../generated/prisma/client.js';
import type {
  CreateClassScheduleInput,
  UpdateClassScheduleInput,
} from './classSchedule.schemas.js';

export class ClassScheduleRepository {
  async getAll(): Promise<ClassSchedule[]> {
    return prisma.classSchedule.findMany({
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
        instructor: { connect: { id: input.instructorId } },
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
        instructor:
          input.instructorId !== undefined
            ? { connect: { id: input.instructorId } }
            : undefined,
      },
    });
  }

  async delete(id: number): Promise<ClassSchedule> {
    return prisma.classSchedule.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // opcionales (si ya los usabas en tu router anterior)
  async getByInstructorId(instructorId: number): Promise<ClassSchedule[]> {
    return prisma.classSchedule.findMany({
      where: { instructorId, deletedAt: null },
    });
  }

  async getByCategory(category: CreateClassScheduleInput['category']): Promise<ClassSchedule[]> {
    return prisma.classSchedule.findMany({
      where: { category, deletedAt: null },
    });
  }
}