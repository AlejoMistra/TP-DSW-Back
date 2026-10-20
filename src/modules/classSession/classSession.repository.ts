import { prisma } from '../../lib/prisma.js';
import type {
  ClassSession,
  ClassSchedule,
  ClassSessionRecurrence,
  Instructor,
} from '../../generated/prisma/client.js';
import type {
  CreateClassSessionInput,
  RecurrenceScope,
} from './classSession.schemas.js';
import { getPaginationParams } from '../../shared/pagination.js';
import { normalizeDateToUTC } from './recurrenceUtils.js';

function buildDateFilter(date?: string) {
  if (!date) return undefined;
  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(`${date}T23:59:59.999Z`);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return undefined;
  return { gte: start, lte: end };
}

export class ClassSessionRepository {
  async getAll(
    page = 1,
    limit = 500,
    date?: string,
  ): Promise<
    (ClassSession & {
      classSchedule: ClassSchedule;
      recurrence?: ClassSessionRecurrence | null;
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
      include: { classSchedule: true, recurrence: true, instructor: true },
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
        recurrence?: ClassSessionRecurrence | null;
        instructor: Instructor | null;
      })
    | null
  > {
    return prisma.classSession.findFirst({
      where: { id, deletedAt: null },
      include: { classSchedule: true, recurrence: true, instructor: true },
    });
  }

  async getByInstructor(instructorId: number): Promise<
    (ClassSession & {
      classSchedule: ClassSchedule;
      recurrence?: ClassSessionRecurrence | null;
      instructor: Instructor | null;
    })[]
  > {
    return prisma.classSession.findMany({
      where: { instructorId, deletedAt: null },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      include: { classSchedule: true, recurrence: true, instructor: true },
    });
  }

  async getBySchedule(classScheduleId: number): Promise<
    (ClassSession & {
      classSchedule: ClassSchedule;
      recurrence?: ClassSessionRecurrence | null;
      instructor: Instructor | null;
    })[]
  > {
    return prisma.classSession.findMany({
      where: { classScheduleId, deletedAt: null },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      include: { classSchedule: true, recurrence: true, instructor: true },
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

  /**
   * Busca todas las sesiones activas de un instructor dentro de un rango de fechas para validar colisiones en lote
   */
  async findActiveSessionsByInstructorInDates(
    instructorId: number,
    dates: Date[],
  ): Promise<(ClassSession & { classSchedule: ClassSchedule })[]> {
    if (dates.length === 0) return [];
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    minDate.setHours(0, 0, 0, 0);
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));
    maxDate.setHours(23, 59, 59, 999);

    return prisma.classSession.findMany({
      where: {
        instructorId,
        date: {
          gte: minDate,
          lte: maxDate,
        },
        status: { not: 'CANCELLED' },
        deletedAt: null,
      },
      include: { classSchedule: true },
    });
  }

  /**
   * Crea una serie recurrente y materializa todas sus instancias atómicamente
   */
  async createRecurrentSeries(
    recurrenceData: {
      frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
      daysOfWeek?: string | null;
      startDate: Date;
      endDate: Date;
    },
    sessionsData: {
      classScheduleId: number;
      instructorId: number | null;
      date: Date;
      startTime: string;
      remainingCapacity: number;
      status: 'SCHEDULED';
    }[],
  ): Promise<
    ClassSession & {
      classSchedule: ClassSchedule;
      recurrence?: ClassSessionRecurrence | null;
    }
  > {
    return prisma.$transaction(async (tx) => {
      // Si existen sesiones dadas de baja (soft-deleted) para este instructor, horario y fechas,
      // se purgan para evitar violar la restricción UNIQUE de MySQL al recrear la serie
      if (sessionsData.length > 0 && sessionsData[0].instructorId) {
        const instId = sessionsData[0].instructorId;
        const targetDates = sessionsData.map((s) => s.date);
        const startTime = sessionsData[0].startTime;

        await tx.classBooking.deleteMany({
          where: {
            classSession: {
              instructorId: instId,
              date: { in: targetDates },
              startTime,
              deletedAt: { not: null },
            },
          },
        });

        await tx.classSession.deleteMany({
          where: {
            instructorId: instId,
            date: { in: targetDates },
            startTime,
            deletedAt: { not: null },
          },
        });
      }

      const recurrence = await tx.classSessionRecurrence.create({
        data: recurrenceData,
      });

      await tx.classSession.createMany({
        data: sessionsData.map((s) => ({
          ...s,
          recurrenceId: recurrence.id,
        })),
      });

      const firstSession = await tx.classSession.findFirstOrThrow({
        where: { recurrenceId: recurrence.id },
        orderBy: { date: 'asc' },
        include: { classSchedule: true, recurrence: true },
      });

      return firstSession;
    });
  }

  /**
   * Creación simple de una sola sesión
   */
  async create(
    input: CreateClassSessionInput,
    remainingCapacity: number,
  ): Promise<
    ClassSession & {
      classSchedule: ClassSchedule;
      recurrence?: ClassSessionRecurrence | null;
    }
  > {
    return prisma.$transaction(async (tx) => {
      // Si existe una sesión previa soft-deleted para este instructor, fecha y horario,
      // se purga para evitar colisión con el índice UNIQUE de MySQL
      if (input.instructorId) {
        await tx.classBooking.deleteMany({
          where: {
            classSession: {
              instructorId: input.instructorId,
              date: input.date,
              startTime: input.startTime,
              deletedAt: { not: null },
            },
          },
        });

        await tx.classSession.deleteMany({
          where: {
            instructorId: input.instructorId,
            date: input.date,
            startTime: input.startTime,
            deletedAt: { not: null },
          },
        });
      }

      return tx.classSession.create({
        data: {
          classSchedule: { connect: { id: input.classScheduleId } },
          instructor: input.instructorId
            ? { connect: { id: input.instructorId } }
            : undefined,
          date: input.date,
          startTime: input.startTime,
          remainingCapacity,
          status: input.status ?? 'SCHEDULED',
        },
        include: { classSchedule: true, recurrence: true },
      });
    });
  }

  /**
   * Devuelve las sesiones alcanzadas según el scope
   */
  async getSessionsByScope(
    session: ClassSession,
    scope: RecurrenceScope,
  ): Promise<(ClassSession & { classSchedule: ClassSchedule })[]> {
    if (scope === 'this' || !session.recurrenceId) {
      return prisma.classSession.findMany({
        where: { id: session.id, deletedAt: null },
        include: { classSchedule: true },
      });
    }

    if (scope === 'following') {
      return prisma.classSession.findMany({
        where: {
          recurrenceId: session.recurrenceId,
          date: { gte: session.date },
          deletedAt: null,
        },
        orderBy: { date: 'asc' },
        include: { classSchedule: true },
      });
    }

    // scope === 'all': sesiones de hoy en adelante (>= hoy 00:00:00 UTC)
    const startOfToday = normalizeDateToUTC(new Date());

    return prisma.classSession.findMany({
      where: {
        recurrenceId: session.recurrenceId,
        date: { gte: startOfToday },
        deletedAt: null,
      },
      orderBy: { date: 'asc' },
      include: { classSchedule: true },
    });
  }

  /**
   * Cuenta reservas confirmadas de un conjunto de sesiones
   */
  async countConfirmedBookings(sessionIds: number[]): Promise<number> {
    if (sessionIds.length === 0) return 0;
    return prisma.classBooking.count({
      where: {
        classSessionId: { in: sessionIds },
        status: 'CONFIRMED',
        deletedAt: null,
      },
    });
  }

  /**
   * Actualiza una sesión puntual con alcance 'this' (manteniendo su vinculación a la serie)
   */
  async updateSingleSession(
    id: number,
    data: {
      instructorId?: number | null;
      date?: Date;
      startTime?: string;
      status?: 'SCHEDULED' | 'CANCELLED';
    },
  ): Promise<
    ClassSession & {
      classSchedule: ClassSchedule;
      recurrence?: ClassSessionRecurrence | null;
    }
  > {
    return prisma.classSession.update({
      where: { id },
      data: {
        instructorId:
          data.instructorId !== undefined ? data.instructorId : undefined,
        date: data.date,
        startTime: data.startTime,
        status: data.status,
      },
      include: { classSchedule: true, recurrence: true },
    });
  }

  /**
   * Actualiza sesiones masivamente in-place (para scope 'all')
   */
  async updateSessionsInPlace(
    sessionIds: number[],
    data: {
      instructorId?: number | null;
      startTime?: string;
      status?: 'SCHEDULED' | 'CANCELLED';
    },
  ): Promise<void> {
    await prisma.classSession.updateMany({
      where: { id: { in: sessionIds } },
      data: {
        ...(data.instructorId !== undefined && {
          instructorId: data.instructorId,
        }),
        ...(data.startTime && { startTime: data.startTime }),
        ...(data.status && { status: data.status }),
      },
    });
  }

  /**
   * Alcance 'following': Corta la serie vieja y crea una nueva serie para las sesiones desde esa fecha
   */
  async cutAndForkSeries(
    oldRecurrenceId: number,
    cutDate: Date,
    sessionIdsToFork: number[],
    updates: {
      instructorId?: number | null;
      startTime?: string;
      status?: 'SCHEDULED' | 'CANCELLED';
    },
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const oldRecurrence = await tx.classSessionRecurrence.findUniqueOrThrow({
        where: { id: oldRecurrenceId },
      });

      // Si la fecha de corte es igual o anterior al inicio de la serie original (o se bifurcan todas las sesiones),
      // no creamos una serie nueva con fechas invertidas, sino que actualizamos las sesiones de la serie in-place
      const cutDateNorm = new Date(cutDate).getTime();
      const startDateNorm = new Date(oldRecurrence.startDate).getTime();

      if (cutDateNorm <= startDateNorm) {
        await tx.classSession.updateMany({
          where: { id: { in: sessionIdsToFork } },
          data: {
            ...(updates.instructorId !== undefined && {
              instructorId: updates.instructorId,
            }),
            ...(updates.startTime && { startTime: updates.startTime }),
            ...(updates.status && { status: updates.status }),
          },
        });
        return;
      }

      // 1. Acotar fecha fin de la serie original al día anterior
      const previousDay = new Date(cutDate);
      previousDay.setUTCDate(previousDay.getUTCDate() - 1);

      await tx.classSessionRecurrence.update({
        where: { id: oldRecurrenceId },
        data: { endDate: previousDay },
      });

      // 2. Crear nueva recurrencia que hereda frecuencia/días pero arranca en cutDate
      const newRecurrence = await tx.classSessionRecurrence.create({
        data: {
          frequency: oldRecurrence.frequency,
          daysOfWeek: oldRecurrence.daysOfWeek,
          startDate: cutDate,
          endDate: oldRecurrence.endDate,
        },
      });

      // 3. Reasignar sesiones a la nueva serie y aplicar los updates
      await tx.classSession.updateMany({
        where: { id: { in: sessionIdsToFork } },
        data: {
          recurrenceId: newRecurrence.id,
          ...(updates.instructorId !== undefined && {
            instructorId: updates.instructorId,
          }),
          ...(updates.startTime && { startTime: updates.startTime }),
          ...(updates.status && { status: updates.status }),
        },
      });
    });
  }

  /**
   * Elimina lógicamente sesiones y cancela sus reservas confirmadas en una transacción
   */
  async softDeleteSessions(sessionIds: number[]): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const now = new Date();
      await tx.classBooking.updateMany({
        where: { classSessionId: { in: sessionIds }, status: 'CONFIRMED' },
        data: { status: 'CANCELLED', deletedAt: now },
      });
      await tx.classSession.updateMany({
        where: { id: { in: sessionIds } },
        data: { deletedAt: now },
      });
    });
  }

  /**
   * Cancela sesiones y cancela sus reservas confirmadas
   */
  async cancelSessions(sessionIds: number[]): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.classBooking.updateMany({
        where: { classSessionId: { in: sessionIds }, status: 'CONFIRMED' },
        data: { status: 'CANCELLED' },
      });
      await tx.classSession.updateMany({
        where: { id: { in: sessionIds } },
        data: { status: 'CANCELLED' },
      });
    });
  }

  async delete(id: number): Promise<void> {
    await this.softDeleteSessions([id]);
  }
}
