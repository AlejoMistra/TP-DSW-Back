import {
  ClassSessionResponseSchema,
  type ClassSessionResponse,
  type CreateClassSessionInput,
  type UpdateClassSessionInput,
  type RecurrenceScope,
} from './classSession.schemas.js';
import { ClassSessionRepository } from './classSession.repository.js';
import { ClassSession, ClassSchedule, type Prisma } from '../../generated/prisma/client.js';
import { ClassScheduleRepository } from '../classSchedule/classSchedule.repository.js';
import { InstructorRepository } from '../instructor/instructor.repository.js';
import { calculateEndTime, doIntervalsOverlap } from '../../utils/timeUtils.js';
import { generateOccurrenceDates, startOfTodayUtc, MAX_OCCURRENCES } from '../../utils/recurrence.js';
import { NotFoundError, ConflictError, BadRequestError } from '../../utils/errors.js';

import { type PaginatedResponse } from '../../shared/pagination.js';

type SessionWithSchedule = ClassSession & { classSchedule: ClassSchedule };

const formatDate = (date: Date) => date.toISOString().slice(0, 10);

export class ClassSessionService {
  constructor(
    private readonly repository: ClassSessionRepository,
    private readonly classScheduleRepository: ClassScheduleRepository,
    private readonly instructorRepository: InstructorRepository,
  ) {}

  async getAll(page = 1, limit = 10): Promise<PaginatedResponse<ClassSessionResponse>> {
    const [sessions, total] = await Promise.all([
      this.repository.getAll(page, limit),
      this.repository.count(),
    ]);
    return {
      items: sessions.map((s) => this.toResponse(s)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async getById(id: number): Promise<ClassSessionResponse> {
    const session = await this.repository.getById(id);
    if (!session) throw new NotFoundError(`Sesión de clase con ID ${id} no encontrada`);
    return this.toResponse(session);
  }

  async getByInstructor(instructorId: number): Promise<ClassSessionResponse[]> {
    const sessions = await this.repository.getByInstructor(instructorId);
    return sessions.map((s) => this.toResponse(s));
  }

  async getBySchedule(classScheduleId: number): Promise<ClassSessionResponse[]> {
    const sessions = await this.repository.getBySchedule(classScheduleId);
    return sessions.map((s) => this.toResponse(s));
  }

  private async checkInstructorOverlap(instructorId: number, date: Date, startTime: string, durationMinutes: number, excludeSessionId?: number) {
    const activeSessions = await this.repository.findActiveSessionsByInstructorAndDate(instructorId, date);

    for (const session of activeSessions) {
      if (excludeSessionId && session.id === excludeSessionId) continue;

      const overlap = doIntervalsOverlap(
        startTime,
        durationMinutes,
        session.startTime,
        session.classSchedule.durationMinutes
      );

      if (overlap) {
        throw new ConflictError(`El instructor ya tiene una clase asignada que se solapa a las ${session.startTime}`);
      }
    }
  }

  async create(input: CreateClassSessionInput): Promise<ClassSessionResponse | ClassSessionResponse[]> {
    const schedule = await this.classScheduleRepository.getById(input.classScheduleId);
    if (!schedule) throw new NotFoundError(`Tipo de clase con ID ${input.classScheduleId} no encontrado`);

    if (input.instructorId) {
      const instructor = await this.instructorRepository.getById(input.instructorId);
      if (!instructor) throw new NotFoundError(`Instructor con ID ${input.instructorId} no encontrado`);
    }


    if (!input.recurrence) {
      if (input.instructorId) {
        await this.checkInstructorOverlap(input.instructorId, input.date, input.startTime, schedule.durationMinutes);
      }
      const session = await this.repository.create(input, schedule.maxCapacity);
      return this.toResponse(session);
    }


    const dates = generateOccurrenceDates({
      frequency: input.recurrence.frequency,
      interval: input.recurrence.interval,
      startDate: input.date,
      endDate: input.recurrence.endDate,
    });
    if (dates.length > MAX_OCCURRENCES) {
      throw new BadRequestError(`La recurrencia no puede generar más de ${MAX_OCCURRENCES} sesiones`);
    }

    if (input.instructorId) {
      const conflicts: string[] = [];
      for (const date of dates) {
        try {
          await this.checkInstructorOverlap(input.instructorId, date, input.startTime, schedule.durationMinutes);
        } catch (error) {
          if (error instanceof ConflictError) conflicts.push(formatDate(date));
          else throw error;
        }
      }
      if (conflicts.length > 0) {
        throw new ConflictError(`El instructor tiene conflictos de horario en: ${conflicts.join(', ')}`);
      }
    }

    const sessions = await this.repository.createWithRecurrence(
      { ...input, recurrence: input.recurrence },
      dates,
      schedule.maxCapacity,
    );
    return sessions.map((s) => this.toResponse(s));
  }

  private async resolveTargets(existing: SessionWithSchedule, scope: RecurrenceScope) {
    if (scope === 'THIS' || existing.recurrenceId === null) {
      return { targets: [existing], remaining: [] as SessionWithSchedule[], scoped: false };
    }

    const all = await this.repository.findByRecurrence(existing.recurrenceId); // orden ascendente por fecha
    const today = startOfTodayUtc();

    const targets =
      scope === 'ALL'
        ? all.filter((s) => s.id === existing.id || s.date >= today) // TBD: solo futuras (más la editada)
        : all.filter((s) => s.date >= existing.date); // FOLLOWING

    const targetIds = new Set(targets.map((s) => s.id));
    const remaining = all.filter((s) => !targetIds.has(s.id));

    return { targets, remaining, scoped: true };
  }

  async updateWithScope(
    id: number,
    input: UpdateClassSessionInput,
    scope: RecurrenceScope,
    confirm: boolean,
  ): Promise<ClassSessionResponse[]> {
    const existing = await this.repository.getById(id);
    if (!existing) throw new NotFoundError(`Sesión de clase con ID ${id} no encontrada`);

    const { targets, remaining, scoped } = await this.resolveTargets(existing, scope);

    if (scoped && input.date !== undefined) {
      throw new BadRequestError('Para cambiar la fecha de una sesión usá scope=THIS');
    }

    let newSchedule: ClassSchedule | null = null;
    if (input.classScheduleId !== undefined && input.classScheduleId !== existing.classScheduleId) {
      newSchedule = await this.classScheduleRepository.getById(input.classScheduleId);
      if (!newSchedule) throw new NotFoundError(`Tipo de clase con ID ${input.classScheduleId} no encontrado`);
    }

    if (typeof input.instructorId === 'number') {
      const instructor = await this.instructorRepository.getById(input.instructorId);
      if (!instructor) throw new NotFoundError(`Instructor con ID ${input.instructorId} no encontrado`);
    }

    const confirmedBookings = await this.repository.countConfirmedBookings(targets.map((s) => s.id));

    const items: { id: number; data: Prisma.ClassSessionUncheckedUpdateInput }[] = [];
    const capacityErrors: string[] = [];
    const cancelBookingsOf: number[] = [];

    for (const session of targets) {
      const schedule = newSchedule ?? session.classSchedule;
      const instructorId = input.instructorId !== undefined ? input.instructorId : session.instructorId;
      const status = input.status ?? session.status;
      const bookings = confirmedBookings.get(session.id) ?? 0;

      if (instructorId && status !== 'CANCELLED') {
        await this.checkInstructorOverlap(
          instructorId,
          input.date ?? session.date,
          input.startTime ?? session.startTime,
          schedule.durationMinutes,
          session.id,
        );
      }

      const data: Prisma.ClassSessionUncheckedUpdateInput = {
        classScheduleId: input.classScheduleId,
        instructorId: input.instructorId,
        date: input.date,
        startTime: input.startTime,
        status: input.status,
      };

      const cancelsBookings =
        input.status === 'CANCELLED' && session.status !== 'CANCELLED' && bookings > 0;

      if (cancelsBookings) {
        data.remainingCapacity = schedule.maxCapacity;
        cancelBookingsOf.push(session.id);
      } else if (newSchedule) {
        // Cambio de capacidad: no puede quedar por debajo de las reservas confirmadas
        if (newSchedule.maxCapacity < bookings) {
          capacityErrors.push(`${formatDate(session.date)} (${bookings} reservas)`);
          continue;
        }
        data.remainingCapacity = newSchedule.maxCapacity - bookings;
      }

      items.push({ id: session.id, data });
    }

    if (capacityErrors.length > 0) {
      throw new ConflictError(
        `La nueva capacidad máxima (${newSchedule!.maxCapacity}) es menor a las reservas confirmadas en: ${capacityErrors.join(', ')}`,
      );
    }

    if (cancelBookingsOf.length > 0 && !confirm) {
      const total = cancelBookingsOf.reduce((acc, sessionId) => acc + (confirmedBookings.get(sessionId) ?? 0), 0);
      throw new ConflictError(
        `Cancelar afecta ${total} reservas confirmadas en ${cancelBookingsOf.length} sesión(es). Reenviá con confirm=true para cancelarlas`,
      );
    }

    let split;
    if (scope === 'FOLLOWING' && existing.recurrenceId !== null && remaining.length > 0) {
      const recurrence = await this.repository.getRecurrenceById(existing.recurrenceId);
      if (recurrence) {
        split = {
          oldRecurrenceId: recurrence.id,
          oldEndDate: remaining[remaining.length - 1].date, // última sesión que queda en la serie original
          newRecurrence: {
            frequency: recurrence.frequency,
            interval: recurrence.interval,
            startDate: existing.date,
            endDate: recurrence.endDate,
          },
        };
      }
    }

    await this.repository.applyChanges(items, cancelBookingsOf, split);

    const updated = await this.repository.getByIds(items.map((item) => item.id));
    return updated.map((s) => this.toResponse(s));
  }

  async deleteWithScope(id: number, scope: RecurrenceScope, confirm: boolean): Promise<void> {
    const existing = await this.repository.getById(id);
    if (!existing) throw new NotFoundError(`Sesión de clase con ID ${id} no encontrada`);

    const { targets, remaining, scoped } = await this.resolveTargets(existing, scope);

    const confirmedBookings = await this.repository.countConfirmedBookings(targets.map((s) => s.id));
    const withBookings = targets.filter((s) => (confirmedBookings.get(s.id) ?? 0) > 0);

    // TBD (alert vs bloqueo): se pide confirmación explícita antes de cancelar reservas
    if (withBookings.length > 0 && !confirm) {
      const total = withBookings.reduce((acc, s) => acc + (confirmedBookings.get(s.id) ?? 0), 0);
      throw new ConflictError(
        `Eliminar afecta ${total} reservas confirmadas en ${withBookings.length} sesión(es). Reenviá con confirm=true para continuar`,
      );
    }

    let recurrence;
    if (scoped && existing.recurrenceId !== null) {
      recurrence =
        remaining.length === 0
          ? ({ id: existing.recurrenceId, action: 'DELETE' } as const)
          : ({ id: existing.recurrenceId, action: 'CLOSE', endDate: remaining[remaining.length - 1].date } as const);
    }

    await this.repository.softDeleteSessions(
      targets.map((s) => s.id),
      withBookings.length > 0,
      recurrence,
    );
  }

  private toResponse(session: ClassSession & { classSchedule: ClassSchedule }): ClassSessionResponse {
    const endTime = calculateEndTime(session.startTime, session.classSchedule.durationMinutes);
    return ClassSessionResponseSchema.parse({
      id: session.id,
      classScheduleId: session.classScheduleId,
      instructorId: session.instructorId,
      date: session.date,
      startTime: session.startTime,
      endTime,
      remainingCapacity: session.remainingCapacity,
      status: session.status,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      deletedAt: session.deletedAt,
      recurrenceId: session.recurrenceId,
    });
  }
}