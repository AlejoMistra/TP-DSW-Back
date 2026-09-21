import { prisma } from '../../lib/prisma.js';
import type { ClassSession, ClassSchedule } from '../../generated/prisma/client.js';
import type {
  CreateClassSessionInput,
  UpdateClassSessionInput,
} from './classSession.schemas.js';

export class ClassSessionRepository {
  async getAll(): Promise<(ClassSession & { classSchedule: ClassSchedule })[]> {
    return prisma.classSession.findMany({
      where: { deletedAt: null },
      include: { classSchedule: true },
    });
  }

  async getById(id: number): Promise<(ClassSession & { classSchedule: ClassSchedule }) | null> {
    return prisma.classSession.findFirst({
      where: { id, deletedAt: null },
      include: { classSchedule: true },
    });
  }

  async findActiveSessionsByInstructorAndDate(
    instructorId: number,
    date: Date,
  ): Promise<(ClassSession & { classSchedule: ClassSchedule })[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.classSession.findMany({
      where: {
        instructorId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: { not: 'CANCELLED' },
        deletedAt: null,
      },
      include: { classSchedule: true },
    });
  }
  
  async getByInstructor(instructorId: number): Promise<(ClassSession & { classSchedule: ClassSchedule })[]> {
    return prisma.classSession.findMany({
      where: { instructorId, deletedAt: null },
      include: { classSchedule: true },
    });
  }

  async getBySchedule(classScheduleId: number): Promise<(ClassSession & { classSchedule: ClassSchedule })[]> {
    return prisma.classSession.findMany({
      where: { classScheduleId, deletedAt: null },
      include: { classSchedule: true },
    });
  }

  async create(input: CreateClassSessionInput, remainingCapacity: number): Promise<ClassSession & { classSchedule: ClassSchedule }> {
    return prisma.classSession.create({
      data: {
        classSchedule: { connect: { id: input.classScheduleId } },
        instructor: input.instructorId ? { connect: { id: input.instructorId } } : undefined,
        date: input.date,
        startTime: input.startTime,
        remainingCapacity: remainingCapacity,
        status: input.status ?? 'SCHEDULED',
      },
      include: { classSchedule: true },
    });
  }

  async update(id: number, input: UpdateClassSessionInput): Promise<ClassSession & { classSchedule: ClassSchedule }> {
    return prisma.classSession.update({
      where: { id },
      data: {
        classSchedule:
          input.classScheduleId !== undefined
            ? { connect: { id: input.classScheduleId } }
            : undefined,
        instructor:
          input.instructorId !== undefined
            ? input.instructorId
              ? { connect: { id: input.instructorId } }
              : { disconnect: true }
            : undefined,
        date: input.date,
        startTime: input.startTime,
        status: input.status,
      },
      include: { classSchedule: true },
    });
  }

  async delete(id: number): Promise<ClassSession> {
    return prisma.classSession.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}