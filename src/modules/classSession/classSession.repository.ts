import { prisma } from '../../lib/prisma.js';
import type { ClassSession, ClassSchedule, Prisma } from '../../generated/prisma/client.js';
import type {
  CreateClassSessionInput,
  RecurrenceInput,
} from './classSession.schemas.js';

import { getPaginationParams } from '../../shared/pagination.js';

type SessionWithSchedule = ClassSession & { classSchedule: ClassSchedule };

export class ClassSessionRepository {
  async getAll(page?: number, limit?: number): Promise<(ClassSession & { classSchedule: ClassSchedule })[]> {
    const { take, skip } = getPaginationParams(page, limit);
    return prisma.classSession.findMany({
      where: { deletedAt: null },
      take,
      skip,
      orderBy: { date: 'desc' },
      include: { classSchedule: true },
    });
  }

  async count(): Promise<number> {
    return prisma.classSession.count({
      where: { deletedAt: null },
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

  async createWithRecurrence(
    input: CreateClassSessionInput & { recurrence: RecurrenceInput },
    dates: Date[],
    remainingCapacity: number,
  ): Promise<SessionWithSchedule[]> {
    return prisma.$transaction(async (tx) => {
      const recurrence = await tx.classSessionRecurrence.create({
        data: {
          frequency: input.recurrence.frequency,
          interval: input.recurrence.interval,
          startDate: dates[0],
          endDate: input.recurrence.endDate,
        },
      });

      await tx.classSession.createMany({
        data: dates.map((date) => ({
          classScheduleId: input.classScheduleId,
          instructorId: input.instructorId ?? null,
          date,
          startTime: input.startTime,
          remainingCapacity,
          status: input.status ?? ('SCHEDULED' as const),
          recurrenceId: recurrence.id,
        })),
      });

      return tx.classSession.findMany({
        where: { recurrenceId: recurrence.id },
        include: { classSchedule: true },
        orderBy: { date: 'asc' },
      });
    });
  }

  async findByRecurrence(recurrenceId: number): Promise<SessionWithSchedule[]> {
    return prisma.classSession.findMany({
      where: { recurrenceId, deletedAt: null },
      include: { classSchedule: true },
      orderBy: { date: 'asc' },
    });
  }

  async getByIds(ids: number[]): Promise<SessionWithSchedule[]> {
    return prisma.classSession.findMany({
      where: { id: { in: ids }, deletedAt: null },
      include: { classSchedule: true },
      orderBy: { date: 'asc' },
    });
  }

  async getRecurrenceById(id: number) {
    return prisma.classSessionRecurrence.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async countConfirmedBookings(sessionIds: number[]): Promise<Map<number, number>> {
    const rows = await prisma.classBooking.groupBy({
      by: ['classSessionId'],
      where: {
        classSessionId: { in: sessionIds },
        status: 'CONFIRMED',
        deletedAt: null,
      },
      _count: { _all: true },
    });
    return new Map(rows.map((row) => [row.classSessionId, row._count._all]));
  }

  async applyChanges(
    items: { id: number; data: Prisma.ClassSessionUncheckedUpdateInput }[],
    cancelBookingsOfSessionIds: number[],
    split?: {
      oldRecurrenceId: number;
      oldEndDate: Date;
      newRecurrence: {
        frequency: RecurrenceInput['frequency'];
        interval: number;
        startDate: Date;
        endDate: Date;
      };
    },
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      let newRecurrenceId: number | undefined;

      if (split) {
        await tx.classSessionRecurrence.update({
          where: { id: split.oldRecurrenceId },
          data: { endDate: split.oldEndDate },
        });
        const created = await tx.classSessionRecurrence.create({ data: split.newRecurrence });
        newRecurrenceId = created.id;
      }

      if (cancelBookingsOfSessionIds.length > 0) {
        await tx.classBooking.updateMany({
          where: { classSessionId: { in: cancelBookingsOfSessionIds }, status: 'CONFIRMED' },
          data: { status: 'CANCELLED' },
        });
      }

      for (const { id, data } of items) {
        await tx.classSession.update({
          where: { id },
          data: {
            ...data,
            ...(newRecurrenceId !== undefined && { recurrenceId: newRecurrenceId }),
          },
        });
      }
    });
  }

  async softDeleteSessions(
    ids: number[],
    cancelBookings: boolean,
    recurrence?: { id: number; action: 'DELETE' } | { id: number; action: 'CLOSE'; endDate: Date },
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      if (cancelBookings) {
        await tx.classBooking.updateMany({
          where: { classSessionId: { in: ids }, status: 'CONFIRMED' },
          data: { status: 'CANCELLED' },
        });
      }

      await tx.classSession.updateMany({
        where: { id: { in: ids } },
        data: { deletedAt: new Date() },
      });

      if (recurrence?.action === 'DELETE') {
        await tx.classSessionRecurrence.update({
          where: { id: recurrence.id },
          data: { deletedAt: new Date() },
        });
      } else if (recurrence?.action === 'CLOSE') {
        await tx.classSessionRecurrence.update({
          where: { id: recurrence.id },
          data: { endDate: recurrence.endDate },
        });
      }
    });
  }
}