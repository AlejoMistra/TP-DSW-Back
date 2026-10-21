import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClassSessionService } from './classSession.service.js';
import { UpdateClassSessionSchema } from './classSession.schemas.js';
import type { ClassSessionRepository } from './classSession.repository.js';
import type { ClassScheduleRepository } from '../classSchedule/classSchedule.repository.js';
import type { InstructorRepository } from '../instructor/instructor.repository.js';
import { ConflictError } from '../../utils/errors.js';

describe('UpdateClassSessionSchema', () => {
  it('rejects date when scope is all', () => {
    const result = UpdateClassSessionSchema.safeParse({
      params: { id: 1 },
      body: {
        date: '2026-11-20T00:00:00.000Z',
        scope: 'all',
      },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain(
        'El cambio de fecha solo está permitido con alcance "this"',
      );
    }
  });

  it('rejects date when scope is following', () => {
    const result = UpdateClassSessionSchema.safeParse({
      params: { id: 1 },
      body: {
        date: '2026-11-20T00:00:00.000Z',
        scope: 'following',
      },
    });

    expect(result.success).toBe(false);
  });

  it('allows date when scope is this', () => {
    const result = UpdateClassSessionSchema.safeParse({
      params: { id: 1 },
      body: {
        date: '2026-11-20T00:00:00.000Z',
        scope: 'this',
      },
    });

    expect(result.success).toBe(true);
  });

  it('allows startTime and status without date when scope is all', () => {
    const result = UpdateClassSessionSchema.safeParse({
      params: { id: 1 },
      body: {
        startTime: '18:30',
        status: 'SCHEDULED',
        scope: 'all',
      },
    });

    expect(result.success).toBe(true);
  });
});

describe('ClassSessionService - Collision and Recurrence Logic', () => {
  let sessionRepo: { [K in keyof ClassSessionRepository]: ReturnType<typeof vi.fn> };
  let scheduleRepo: { [K in keyof ClassScheduleRepository]: ReturnType<typeof vi.fn> };
  let instructorRepo: { [K in keyof InstructorRepository]: ReturnType<typeof vi.fn> };
  let service: ClassSessionService;

  const mockSchedule = {
    id: 10,
    title: 'Yoga',
    durationMinutes: 60,
    maxCapacity: 20,
  };

  const baseSession = {
    id: 1,
    classScheduleId: 10,
    instructorId: 5,
    recurrenceId: 100,
    date: new Date('2026-11-02T10:00:00Z'),
    startTime: '10:00',
    remainingCapacity: 20,
    status: 'SCHEDULED' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    classSchedule: mockSchedule,
    recurrence: {
      id: 100,
      daysOfWeek: '1',
      startDate: new Date('2026-11-02T10:00:00Z'),
      endDate: new Date('2026-11-30T10:00:00Z'),
    },
  };

  beforeEach(() => {
    sessionRepo = {
      getAll: vi.fn(),
      count: vi.fn(),
      getById: vi.fn(),
      getByInstructor: vi.fn(),
      getBySchedule: vi.fn(),
      findActiveSessionsByInstructorAndDate: vi.fn().mockResolvedValue([]),
      findActiveSessionsByInstructorInDates: vi.fn().mockResolvedValue([]),
      createRecurrentSeries: vi.fn(),
      create: vi.fn(),
      getSessionsByScope: vi.fn(),
      countConfirmedBookings: vi.fn(),
      updateSingleSession: vi.fn(),
      updateSessionsInPlace: vi.fn(),
      cutAndForkSeries: vi.fn(),
      softDeleteSessions: vi.fn(),
      cancelSessions: vi.fn(),
      delete: vi.fn(),
    };
    scheduleRepo = {
      getById: vi.fn(),
    } as any;
    instructorRepo = {
      getById: vi.fn(),
    } as any;

    service = new ClassSessionService(
      sessionRepo as unknown as ClassSessionRepository,
      scheduleRepo as unknown as ClassScheduleRepository,
      instructorRepo as unknown as InstructorRepository,
    );
  });

  describe('update with status CANCELLED', () => {
    it('delegates to cancel() when status is CANCELLED', async () => {
      sessionRepo.getById.mockResolvedValue(baseSession);
      sessionRepo.getSessionsByScope.mockResolvedValue([baseSession]);

      const result = await service.update(1, {
        scope: 'all',
        status: 'CANCELLED',
      });

      expect(sessionRepo.cancelSessions).toHaveBeenCalledWith([1]);
      expect(result.id).toBe(1);
    });
  });

  describe('internal series collision check (Comment #4)', () => {
    it('throws ConflictError if target sessions contain duplicate dates when updating startTime', async () => {
      sessionRepo.getById.mockResolvedValue(baseSession);
      // Dos sesiones en la misma fecha (ej: dos clases el mismo día en la serie)
      const sessionA = { ...baseSession, id: 1, date: new Date('2026-11-02T10:00:00Z') };
      const sessionB = { ...baseSession, id: 2, date: new Date('2026-11-02T16:00:00Z') };
      sessionRepo.getSessionsByScope.mockResolvedValue([sessionA, sessionB]);

      await expect(
        service.update(1, {
          scope: 'all',
          startTime: '18:00',
        }),
      ).rejects.toThrow(ConflictError);
    });

    it('passes internal check if all sessions in series are on different dates', async () => {
      sessionRepo.getById.mockResolvedValue(baseSession);
      // Sesiones en semanas diferentes (distintas fechas)
      const sessionA = { ...baseSession, id: 1, date: new Date('2026-11-02T10:00:00Z') };
      const sessionB = { ...baseSession, id: 2, date: new Date('2026-11-09T10:00:00Z') };
      sessionRepo.getSessionsByScope.mockResolvedValue([sessionA, sessionB]);
      sessionRepo.findActiveSessionsByInstructorAndDate.mockResolvedValue([]);

      await service.update(1, {
        scope: 'all',
        startTime: '18:00',
      });

      expect(sessionRepo.updateSessionsInPlace).toHaveBeenCalledWith(
        [1, 2],
        {
          instructorId: undefined, // no pisa instructor
          startTime: '18:00',
          status: undefined,
        },
      );
    });
  });

  describe('effective instructor & external collision check (Comments #8 and #9)', () => {
    it('checks collision using per-session substitute instructor instead of series primary', async () => {
      sessionRepo.getById.mockResolvedValue(baseSession);

      // sessionA tiene instructor 5 (titular), sessionB tiene instructor 9 (suplente)
      const sessionA = { ...baseSession, id: 1, instructorId: 5, date: new Date('2026-11-02T10:00:00Z') };
      const sessionB = { ...baseSession, id: 2, instructorId: 9, date: new Date('2026-11-09T10:00:00Z') };
      sessionRepo.getSessionsByScope.mockResolvedValue([sessionA, sessionB]);

      // Simulamos que el suplente (ID 9) tiene un choque externo el 2026-11-09 a las 18:00
      sessionRepo.findActiveSessionsByInstructorAndDate.mockImplementation(
        async (instructorId: number, date: Date) => {
          if (instructorId === 9) {
            return [
              {
                id: 99, // clase externa de otro curso
                instructorId: 9,
                date: new Date('2026-11-09T00:00:00Z'),
                startTime: '18:00',
                classSchedule: { durationMinutes: 60 },
              },
            ];
          }
          return [];
        },
      );

      await expect(
        service.update(1, {
          scope: 'all',
          startTime: '18:00', // Colisiona con el suplente (ID 9) el día 9
        }),
      ).rejects.toThrow('El instructor tiene una clase solapada el 2026-11-09');
    });

    it('does not overwrite substitute instructors when instructorId is not provided', async () => {
      sessionRepo.getById.mockResolvedValue(baseSession);
      const sessionA = { ...baseSession, id: 1, instructorId: 5, date: new Date('2026-11-02T10:00:00Z') };
      const sessionB = { ...baseSession, id: 2, instructorId: 9, date: new Date('2026-11-09T10:00:00Z') };
      sessionRepo.getSessionsByScope.mockResolvedValue([sessionA, sessionB]);
      sessionRepo.findActiveSessionsByInstructorAndDate.mockResolvedValue([]);

      await service.update(1, {
        scope: 'all',
        startTime: '11:00',
      });

      // Se pasa instructorId: undefined, lo que permite a Prisma preservar los instructores de cada fila
      expect(sessionRepo.updateSessionsInPlace).toHaveBeenCalledWith(
        [1, 2],
        expect.objectContaining({ instructorId: undefined }),
      );
    });
  });
});
