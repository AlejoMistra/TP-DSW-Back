import { prisma } from '../../lib/prisma.js';
import type {
  ClassSession,
  ClassSchedule,
  Instructor,
} from '../../generated/prisma/client.js';
import type {
  CreateClassSessionInput,
  UpdateClassSessionInput,
} from './classSession.schemas.js';

import { getPaginationParams } from '../../shared/pagination.js';

function buildDateFilter(date?: string) {
  if (!date) return undefined;
  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(`${date}T23:59:59.999Z`);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return undefined;
  return { gte: start, lte: end };
}

export class ClassSessionRepository {
  async getAll(
    page?: number,
    limit?: number,
    date?: string,
  ): Promise<
    (ClassSession & {
      classSchedule: ClassSchedule;
      instructor: Instructor | null;
    })[]
  > {
    const { take, skip } = getPaginationParams(page, limit);
    const dateFilter = buildDateFilter(date);

    return prisma.classSession.findMany({
      where: {
        deletedAt: null,
        ...(dateFilter && { date: dateFilter }),
      },
      take,
      skip,
      orderBy: date ? [{ startTime: 'asc' }] : [{ date: 'desc' }],
      include: {
        classSchedule: true,
        instructor: true,
      },
    });
  }

  async count(date?: string): Promise<number> {
    const dateFilter = buildDateFilter(date);

    return prisma.classSession.count({
      where: {
        deletedAt: null,
        ...(dateFilter && { date: dateFilter }),
      },
    });
  }

  async getById(id: number): Promise<
    | (ClassSession & {
        classSchedule: ClassSchedule;
        instructor: Instructor | null;
      })
    | null
  > {
    return prisma.classSession.findFirst({
      where: { id, deletedAt: null },
      include: { classSchedule: true, instructor: true },
    });
  }

  async findActiveSessionsByInstructorAndDate(
    instructorId: number,
    date: Date,
  ): Promise<(ClassSession & { classSchedule: ClassSchedule })[]> {
    const startOfDay = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );
    const endOfDay = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        23,
        59,
        59,
        999,
      ),
    );

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

  async getByInstructor(
    instructorId: number,
  ): Promise<(ClassSession & { classSchedule: ClassSchedule })[]> {
    return prisma.classSession.findMany({
      where: { instructorId, deletedAt: null },
      include: { classSchedule: true },
    });
  }

  async getBySchedule(
    classScheduleId: number,
  ): Promise<(ClassSession & { classSchedule: ClassSchedule })[]> {
    return prisma.classSession.findMany({
      where: { classScheduleId, deletedAt: null },
      include: { classSchedule: true },
    });
  }

  async create(
    input: CreateClassSessionInput,
    remainingCapacity: number,
  ): Promise<ClassSession & { classSchedule: ClassSchedule }> {
    return prisma.classSession.create({
      data: {
        classSchedule: { connect: { id: input.classScheduleId } },
        instructor: input.instructorId
          ? { connect: { id: input.instructorId } }
          : undefined,
        date: input.date,
        startTime: input.startTime,
        remainingCapacity: remainingCapacity,
        status: input.status ?? 'SCHEDULED',
      },
      include: { classSchedule: true },
    });
  }

  async update(
    id: number,
    input: UpdateClassSessionInput,
  ): Promise<ClassSession & { classSchedule: ClassSchedule }> {
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
