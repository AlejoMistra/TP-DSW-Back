import {
  ClassSessionResponseSchema,
  type ClassSessionResponse,
  type CreateClassSessionInput,
  type UpdateClassSessionInput,
  type RecurrenceScope,
} from './classSession.schemas.js';
import { ClassSessionRepository } from './classSession.repository.js';
import {
  ClassSession,
  ClassSchedule,
  ClassSessionRecurrence,
  Instructor,
} from '../../generated/prisma/client.js';
import { ClassScheduleRepository } from '../classSchedule/classSchedule.repository.js';
import { InstructorRepository } from '../instructor/instructor.repository.js';
import { calculateEndTime, doIntervalsOverlap } from '../../utils/timeUtils.js';
import {
  NotFoundError,
  ConflictError,
  BadRequestError,
} from '../../utils/errors.js';
import { generateRecurrenceDates } from './recurrenceUtils.js';
import { type PaginatedResponse } from '../../shared/pagination.js';

export class ClassSessionService {
  constructor(
    private readonly repository: ClassSessionRepository,
    private readonly classScheduleRepository: ClassScheduleRepository,
    private readonly instructorRepository: InstructorRepository,
  ) {}

  async getAll(
    page = 1,
    limit = 10,
    date?: string,
  ): Promise<PaginatedResponse<ClassSessionResponse>> {
    const [sessions, total] = await Promise.all([
      this.repository.getAll(page, limit, date),
      this.repository.count(date),
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
    if (!session)
      throw new NotFoundError(`Sesión de clase con ID ${id} no encontrada`);
    return this.toResponse(session);
  }

  async getByInstructor(instructorId: number): Promise<ClassSessionResponse[]> {
    const sessions = await this.repository.getByInstructor(instructorId);
    return sessions.map((s) => this.toResponse(s));
  }

  async getBySchedule(
    classScheduleId: number,
  ): Promise<ClassSessionResponse[]> {
    const sessions = await this.repository.getBySchedule(classScheduleId);
    return sessions.map((s) => this.toResponse(s));
  }

  /**
   * Valida solapamiento de horario de un instructor en una fecha dada
   */
  private async checkInstructorOverlap(
    instructorId: number,
    date: Date,
    startTime: string,
    durationMinutes: number,
    excludeSessionId?: number,
  ) {
    const activeSessions =
      await this.repository.findActiveSessionsByInstructorAndDate(
        instructorId,
        date,
      );

    for (const session of activeSessions) {
      if (excludeSessionId && session.id === excludeSessionId) continue;

      const overlap = doIntervalsOverlap(
        startTime,
        durationMinutes,
        session.startTime,
        session.classSchedule.durationMinutes,
      );

      if (overlap) {
        const dateFormatted = new Date(date).toISOString().split('T')[0];
        throw new ConflictError(
          `El instructor ya tiene una clase asignada que se solapa el ${dateFormatted} a las ${session.startTime}`,
        );
      }
    }
  }

  /**
   * Creación atómica de sesión (individual o recurrente)
   */
  async create(input: CreateClassSessionInput): Promise<ClassSessionResponse> {
    const schedule = await this.classScheduleRepository.getById(
      input.classScheduleId,
    );
    if (!schedule)
      throw new NotFoundError(
        `Tipo de clase con ID ${input.classScheduleId} no encontrado`,
      );

    if (input.instructorId) {
      const instructor = await this.instructorRepository.getById(
        input.instructorId,
      );
      if (!instructor)
        throw new NotFoundError(
          `Instructor con ID ${input.instructorId} no encontrado`,
        );
    }

    // 1. Creación masiva recurrente
    if (input.recurrence) {
      const dates = generateRecurrenceDates({
        frequency: input.recurrence.frequency,
        daysOfWeek: input.recurrence.daysOfWeek,
        startDate: input.date,
        endDate: input.recurrence.endDate,
      });

      // Validar atómicamente que el instructor no tenga colisiones en NINGUNA fecha
      if (input.instructorId) {
        const existingInstructorSessions =
          await this.repository.findActiveSessionsByInstructorInDates(
            input.instructorId,
            dates,
          );

        for (const targetDate of dates) {
          const targetDateStr = targetDate.toISOString().split('T')[0];
          const sameDaySessions = existingInstructorSessions.filter(
            (s) =>
              new Date(s.date).toISOString().split('T')[0] === targetDateStr,
          );

          for (const s of sameDaySessions) {
            const overlap = doIntervalsOverlap(
              input.startTime,
              schedule.durationMinutes,
              s.startTime,
              s.classSchedule.durationMinutes,
            );

            if (overlap) {
              throw new ConflictError(
                `Conflicto en creación masiva: El instructor ya tiene una clase asignada el ${targetDateStr} a las ${s.startTime}. Operación abortada.`,
              );
            }
          }
        }
      }

      const recurrenceData = {
        frequency: input.recurrence.frequency,
        daysOfWeek: input.recurrence.daysOfWeek
          ? input.recurrence.daysOfWeek.join(',')
          : null,
        startDate: new Date(input.date),
        endDate: new Date(input.recurrence.endDate),
      };

      const sessionsData = dates.map((d) => ({
        classScheduleId: input.classScheduleId,
        instructorId: input.instructorId ?? null,
        date: d,
        startTime: input.startTime,
        remainingCapacity: schedule.maxCapacity,
        status: (input.status ?? 'SCHEDULED') as 'SCHEDULED' | 'CANCELLED',
      }));

      const createdFirst = await this.repository.createRecurrentSeries(
        recurrenceData,
        sessionsData,
      );
      return this.toResponse(createdFirst);
    }

    // 2. Creación individual tradicional
    if (input.instructorId) {
      await this.checkInstructorOverlap(
        input.instructorId,
        input.date,
        input.startTime,
        schedule.durationMinutes,
      );
    }

    const session = await this.repository.create(input, schedule.maxCapacity);
    return this.toResponse(session);
  }

  /**
   * Consulta cantidad de clases y reservas confirmadas que serán impactadas
   */
  async getAffectedBookings(
    id: number,
    scope: RecurrenceScope = 'this',
  ): Promise<{ sessionCount: number; confirmedBookingsCount: number }> {
    const session = await this.repository.getById(id);
    if (!session)
      throw new NotFoundError(`Sesión de clase con ID ${id} no encontrada`);

    const affectedSessions = await this.repository.getSessionsByScope(
      session,
      scope,
    );
    const sessionIds = affectedSessions.map((s) => s.id);
    const confirmedBookingsCount =
      await this.repository.countConfirmedBookings(sessionIds);

    return { sessionCount: affectedSessions.length, confirmedBookingsCount };
  }

  /**
   * Actualización con soporte de alcance Google Calendar
   */
  async update(
    id: number,
    input: UpdateClassSessionInput,
  ): Promise<ClassSessionResponse> {
    const existing = await this.repository.getById(id);
    if (!existing)
      throw new NotFoundError(`Sesión de clase con ID ${id} no encontrada`);

    const scope: RecurrenceScope = input.scope || 'this';
    const schedule = existing.classSchedule;

    // Si la actualización es para cancelar, delegamos en cancel() que ya maneja reservas y cupo
    if (input.status === 'CANCELLED') {
      await this.cancel(id, scope);
      const reloaded = await this.repository.getById(id);
      return this.toResponse(reloaded!);
    }

    if (input.instructorId) {
      const instructor = await this.instructorRepository.getById(
        input.instructorId,
      );
      if (!instructor)
        throw new NotFoundError(
          `Instructor con ID ${input.instructorId} no encontrado`,
        );
    }

    // 1. Scope THIS
    if (scope === 'this' || !existing.recurrenceId) {
      const instructorToCheck =
        input.instructorId !== undefined
          ? input.instructorId
          : existing.instructorId;
      if (instructorToCheck) {
        await this.checkInstructorOverlap(
          instructorToCheck,
          input.date ?? existing.date,
          input.startTime ?? existing.startTime,
          schedule.durationMinutes,
          id,
        );
      }

      const updated = await this.repository.updateSingleSession(id, {
        instructorId: input.instructorId,
        date: input.date,
        startTime: input.startTime,
        status: input.status,
      });
      return this.toResponse(updated);
    }

    // 2. Scopes ALL o FOLLOWING
    const targetSessions = await this.repository.getSessionsByScope(
      existing,
      scope,
    );
    const targetSessionIds = targetSessions.map((s) => s.id);

    // Comentario #4: Conflicto interno si cambiamos horario y hay más de una clase el mismo día
    if (input.startTime) {
      const dates = targetSessions.map(
        (s) => new Date(s.date).toISOString().split('T')[0],
      );
      if (new Set(dates).size !== dates.length) {
        throw new ConflictError(
          'Conflicto interno en la serie: existen múltiples clases en la misma fecha.',
        );
      }
    }

    // Comentarios #8 y #9: Validar solapamientos externos con instructor y horario efectivos
    if (input.startTime !== undefined || input.instructorId !== undefined) {
      for (const s of targetSessions) {
        const effInstructor =
          input.instructorId !== undefined
            ? input.instructorId
            : s.instructorId;
        const effStartTime = input.startTime ?? s.startTime;
        if (effInstructor) {
          const overlaps =
            await this.repository.findActiveSessionsByInstructorAndDate(
              effInstructor,
              s.date,
            );
          const hasCollision = overlaps.some(
            (o) =>
              !targetSessionIds.includes(o.id) &&
              doIntervalsOverlap(
                effStartTime,
                schedule.durationMinutes,
                o.startTime,
                o.classSchedule.durationMinutes,
              ),
          );
          if (hasCollision) {
            const dateStr = new Date(s.date).toISOString().split('T')[0];
            throw new ConflictError(
              `El instructor tiene una clase solapada el ${dateStr}. Actualización cancelada.`,
            );
          }
        }
      }
    }

    // Actualización en Repository: pasamos input.instructorId directamente (sin fallback a existing)
    if (scope === 'all') {
      await this.repository.updateSessionsInPlace(targetSessionIds, {
        instructorId: input.instructorId,
        startTime: input.startTime,
        status: input.status,
      });
    } else if (scope === 'following') {
      await this.repository.cutAndForkSeries(
        existing.recurrenceId,
        existing.date,
        targetSessionIds,
        {
          instructorId: input.instructorId,
          startTime: input.startTime,
          status: input.status,
        },
      );
    }

    const reloaded = await this.repository.getById(id);
    return this.toResponse(reloaded!);
  }

  /**
   * Cancelación de sesiones y sus reservas confirmadas
   */
  async cancel(id: number, scope: RecurrenceScope = 'this'): Promise<void> {
    const existing = await this.repository.getById(id);
    if (!existing)
      throw new NotFoundError(`Sesión de clase con ID ${id} no encontrada`);

    const targetSessions = await this.repository.getSessionsByScope(
      existing,
      scope,
    );
    const targetSessionIds = targetSessions.map((s) => s.id);

    await this.repository.cancelSessions(targetSessionIds);
  }

  /**
   * Eliminación (soft delete) de sesiones y cancelación de sus reservas
   */
  async delete(id: number, scope: RecurrenceScope = 'this'): Promise<void> {
    const existing = await this.repository.getById(id);
    if (!existing)
      throw new NotFoundError(`Sesión de clase con ID ${id} no encontrada`);

    const targetSessions = await this.repository.getSessionsByScope(
      existing,
      scope,
    );
    const targetSessionIds = targetSessions.map((s) => s.id);

    await this.repository.softDeleteSessions(targetSessionIds);
  }

  private toResponse(
    session: ClassSession & {
      classSchedule: ClassSchedule;
      recurrence?: ClassSessionRecurrence | null;
      instructor?: Instructor | null;
    },
  ): ClassSessionResponse {
    const endTime = calculateEndTime(
      session.startTime,
      session.classSchedule.durationMinutes,
    );
    return ClassSessionResponseSchema.parse({
      id: session.id,
      classScheduleId: session.classScheduleId,
      instructorId: session.instructorId,
      recurrenceId: session.recurrenceId,
      date: session.date,
      startTime: session.startTime,
      endTime,
      remainingCapacity: session.remainingCapacity,
      status: session.status,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      classSchedule: session.classSchedule,
      instructor: session.instructor,
      recurrence: session.recurrence,
    });
  }
}
