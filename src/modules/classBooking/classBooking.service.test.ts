import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClassBookingService } from './classBooking.service.js';
import type { ClassBookingRepository } from './classBooking.repository.js';
import { NotFoundError, ConflictError, ForbiddenError } from '../../utils/errors.js';
import { prisma } from '../../lib/prisma.js';
import { UserRole } from '../../generated/prisma/enums.js';
import type { AuthUser } from '../../middlewares/authentication.middleware.js';

vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    $transaction: vi.fn(),
    member: {
      findFirst: vi.fn(),
    },
  },
}));

describe('ClassBookingService', () => {
  let repository: any;
  let service: ClassBookingService;
  let txMock: any;

  beforeEach(() => {
    vi.clearAllMocks();

    repository = {
      getAll: vi.fn(),
      count: vi.fn(),
      getByUserId: vi.fn(),
      getById: vi.fn(),
    };

    service = new ClassBookingService(repository as unknown as ClassBookingRepository);

    txMock = {
      classSession: {
        findFirst: vi.fn(),
        update: vi.fn(),
      },
      member: {
        findFirst: vi.fn(),
      },
      classBooking: {
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
    };

    (prisma.$transaction as any).mockImplementation(async (callback: any) => {
      return callback(txMock);
    });
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const validSession = {
    id: 1,
    date: tomorrow,
    startTime: '10:00',
    remainingCapacity: 5,
    status: 'SCHEDULED',
    deletedAt: null,
  };

  const validMember = {
    id: 10,
    userId: 5,
    status: 'ACTIVE',
    deletedAt: null,
    membership: {
      id: 100,
      status: 'ACTIVE',
      startDate: new Date('2026-01-01'),
      endDate: nextWeek,
      deletedAt: null,
    },
  };

  describe('create', () => {
    it('throws NotFoundError if session does not exist', async () => {
      txMock.classSession.findFirst.mockResolvedValue(null);

      await expect(
        service.create({ memberId: 10, classSessionId: 1 }),
      ).rejects.toThrow(NotFoundError);
    });

    it('throws NotFoundError if member does not exist', async () => {
      txMock.classSession.findFirst.mockResolvedValue(validSession);
      txMock.member.findFirst.mockResolvedValue(null);

      await expect(
        service.create({ memberId: 10, classSessionId: 1 }),
      ).rejects.toThrow(NotFoundError);
    });

    it('throws ConflictError if member status is INACTIVE', async () => {
      txMock.classSession.findFirst.mockResolvedValue(validSession);
      txMock.member.findFirst.mockResolvedValue({
        ...validMember,
        status: 'INACTIVE',
      });

      await expect(
        service.create({ memberId: 10, classSessionId: 1 }),
      ).rejects.toThrow('El socio se encuentra inactivo y no puede reservar clases');
    });

    it('throws ConflictError if member does not have a membership', async () => {
      txMock.classSession.findFirst.mockResolvedValue(validSession);
      txMock.member.findFirst.mockResolvedValue({
        ...validMember,
        membership: null,
      });

      await expect(
        service.create({ memberId: 10, classSessionId: 1 }),
      ).rejects.toThrow('El socio no posee una membresía activa');
    });

    it('throws ConflictError if membership status is not ACTIVE', async () => {
      txMock.classSession.findFirst.mockResolvedValue(validSession);
      txMock.member.findFirst.mockResolvedValue({
        ...validMember,
        membership: {
          ...validMember.membership,
          status: 'CANCELLED',
        },
      });

      await expect(
        service.create({ memberId: 10, classSessionId: 1 }),
      ).rejects.toThrow('La membresía del socio no se encuentra activa');
    });

    it('throws ConflictError if membership is expired today', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 2);

      txMock.classSession.findFirst.mockResolvedValue(validSession);
      txMock.member.findFirst.mockResolvedValue({
        ...validMember,
        membership: {
          ...validMember.membership,
          endDate: yesterday,
        },
      });

      await expect(
        service.create({ memberId: 10, classSessionId: 1 }),
      ).rejects.toThrow('La membresía del socio se encuentra vencida');
    });

    it('permite reservar si la membresía vence hoy y la clase es hoy (fin de día UTC)', async () => {
      const todayUTC = new Date();
      todayUTC.setUTCHours(0, 0, 0, 0);

      const sessionToday = {
        ...validSession,
        date: todayUTC,
      };

      const memberExpiringToday = {
        ...validMember,
        membership: {
          ...validMember.membership,
          endDate: todayUTC,
        },
      };

      txMock.classSession.findFirst.mockResolvedValue(sessionToday);
      txMock.member.findFirst.mockResolvedValue(memberExpiringToday);
      txMock.classBooking.findFirst.mockResolvedValue(null);
      txMock.classBooking.create.mockResolvedValue({
        id: 101,
        memberId: 10,
        classSessionId: 1,
        status: 'CONFIRMED',
        bookingDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const result = await service.create({ memberId: 10, classSessionId: 1 });
      expect(result.id).toBe(101);
      expect(result.status).toBe('CONFIRMED');
    });

    it('throws ConflictError if membership expires before the session date', async () => {
      const sessionDate = new Date();
      sessionDate.setDate(sessionDate.getDate() + 5);

      const membershipEndDate = new Date();
      membershipEndDate.setDate(membershipEndDate.getDate() + 2);

      txMock.classSession.findFirst.mockResolvedValue({
        ...validSession,
        date: sessionDate,
      });
      txMock.member.findFirst.mockResolvedValue({
        ...validMember,
        membership: {
          ...validMember.membership,
          endDate: membershipEndDate,
        },
      });

      await expect(
        service.create({ memberId: 10, classSessionId: 1 }),
      ).rejects.toThrow('La membresía del socio no cubre la fecha de la clase solicitada');
    });

    it('throws ConflictError if session date is before membership startDate (future membership)', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const nextMonth = new Date();
      nextMonth.setDate(nextMonth.getDate() + 30);

      const futureStartDate = new Date();
      futureStartDate.setDate(futureStartDate.getDate() + 7);

      txMock.classSession.findFirst.mockResolvedValue({
        ...validSession,
        date: tomorrow,
      });
      txMock.member.findFirst.mockResolvedValue({
        ...validMember,
        membership: {
          ...validMember.membership,
          startDate: futureStartDate,
          endDate: nextMonth,
        },
      });

      await expect(
        service.create({ memberId: 10, classSessionId: 1 }),
      ).rejects.toThrow('La membresía del socio aún no se encuentra vigente para la fecha de la clase solicitada');
    });

    it('throws ConflictError if member already has a confirmed booking for this session', async () => {
      txMock.classSession.findFirst.mockResolvedValue(validSession);
      txMock.member.findFirst.mockResolvedValue(validMember);
      txMock.classBooking.findFirst.mockResolvedValue({
        id: 50,
        memberId: 10,
        classSessionId: 1,
        status: 'CONFIRMED',
        deletedAt: null,
      });

      await expect(
        service.create({ memberId: 10, classSessionId: 1 }),
      ).rejects.toThrow('El socio ya tiene una reserva para esta clase');
    });

    it('throws ConflictError if session remainingCapacity is 0', async () => {
      txMock.classSession.findFirst.mockResolvedValue({
        ...validSession,
        remainingCapacity: 0,
      });
      txMock.member.findFirst.mockResolvedValue(validMember);
      txMock.classBooking.findFirst.mockResolvedValue(null);

      await expect(
        service.create({ memberId: 10, classSessionId: 1 }),
      ).rejects.toThrow('No hay cupos disponibles');
    });

    it('throws ForbiddenError si un usuario MEMBER intenta reservar para otro memberId (IDOR)', async () => {
      const memberUser: AuthUser = { userId: 5, role: UserRole.MEMBER };
      // El socio del usuario autenticado tiene ID 99, pero intenta reservar para ID 10
      txMock.member.findFirst.mockResolvedValue({
        id: 99,
        userId: 5,
      });

      await expect(
        service.create({ memberId: 10, classSessionId: 1 }, memberUser),
      ).rejects.toThrow(ForbiddenError);
    });

    it('permite a un usuario MEMBER reservar para su propio memberId', async () => {
      const memberUser: AuthUser = { userId: 5, role: UserRole.MEMBER };
      // El socio coincide con el memberId
      txMock.member.findFirst.mockResolvedValue({
        ...validMember,
        id: 10,
        userId: 5,
      });
      txMock.classSession.findFirst.mockResolvedValue(validSession);
      txMock.classBooking.findFirst.mockResolvedValue(null);
      txMock.classBooking.create.mockResolvedValue({
        id: 120,
        memberId: 10,
        classSessionId: 1,
        status: 'CONFIRMED',
        bookingDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const result = await service.create({ memberId: 10, classSessionId: 1 }, memberUser);
      expect(result.id).toBe(120);
    });

    it('successfully creates booking and decrements session capacity', async () => {
      const now = new Date();
      txMock.classSession.findFirst.mockResolvedValue(validSession);
      txMock.member.findFirst.mockResolvedValue(validMember);
      txMock.classBooking.findFirst.mockResolvedValue(null);
      txMock.classBooking.create.mockResolvedValue({
        id: 99,
        memberId: 10,
        classSessionId: 1,
        status: 'CONFIRMED',
        bookingDate: now,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      });

      const result = await service.create({ memberId: 10, classSessionId: 1 });

      expect(result.id).toBe(99);
      expect(result.status).toBe('CONFIRMED');
      expect(txMock.classBooking.create).toHaveBeenCalled();
      expect(txMock.classSession.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { remainingCapacity: { decrement: 1 } },
      });
    });

    it('reactivates a previously cancelled booking', async () => {
      const now = new Date();
      txMock.classSession.findFirst.mockResolvedValue(validSession);
      txMock.member.findFirst.mockResolvedValue(validMember);
      txMock.classBooking.findFirst.mockResolvedValue({
        id: 77,
        memberId: 10,
        classSessionId: 1,
        status: 'CANCELLED',
        deletedAt: null,
      });
      txMock.classBooking.update.mockResolvedValue({
        id: 77,
        memberId: 10,
        classSessionId: 1,
        status: 'CONFIRMED',
        bookingDate: now,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      });

      const result = await service.create({ memberId: 10, classSessionId: 1 });

      expect(result.id).toBe(77);
      expect(result.status).toBe('CONFIRMED');
      expect(txMock.classBooking.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 77 },
          data: expect.objectContaining({ status: 'CONFIRMED', deletedAt: null }),
        }),
      );
      expect(txMock.classSession.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { remainingCapacity: { decrement: 1 } },
      });
    });
  });

  describe('update', () => {
    it('throws ForbiddenError si un MEMBER intenta modificar una reserva ajena', async () => {
      const memberUser: AuthUser = { userId: 5, role: UserRole.MEMBER };
      txMock.classBooking.findFirst.mockResolvedValue({
        id: 88,
        memberId: 10, // Reserva del socio 10
        classSessionId: 1,
        status: 'CONFIRMED',
        deletedAt: null,
      });
      txMock.member.findFirst.mockResolvedValue({
        id: 99, // Usuario 5 es socio 99
        userId: 5,
      });

      await expect(
        service.update(88, { status: 'CANCELLED' }, memberUser),
      ).rejects.toThrow(ForbiddenError);
    });

    it('allows cancelling a booking without checking membership and increments capacity', async () => {
      const now = new Date();
      txMock.classBooking.findFirst.mockResolvedValue({
        id: 88,
        memberId: 10,
        classSessionId: 1,
        status: 'CONFIRMED',
        deletedAt: null,
        bookingDate: now,
        createdAt: now,
        updatedAt: now,
      });
      txMock.classBooking.update.mockResolvedValue({
        id: 88,
        memberId: 10,
        classSessionId: 1,
        status: 'CANCELLED',
        deletedAt: null,
        bookingDate: now,
        createdAt: now,
        updatedAt: now,
      });

      const result = await service.update(88, { status: 'CANCELLED' });

      expect(result.status).toBe('CANCELLED');
      expect(txMock.member.findFirst).not.toHaveBeenCalled();
      expect(txMock.classSession.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { remainingCapacity: { increment: 1 } },
      });
    });

    it('rejects confirming a cancelled booking if membership is expired', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 2);

      txMock.classBooking.findFirst.mockResolvedValue({
        id: 88,
        memberId: 10,
        classSessionId: 1,
        status: 'CANCELLED',
        deletedAt: null,
      });
      txMock.classSession.findFirst.mockResolvedValue(validSession);
      txMock.member.findFirst.mockResolvedValue({
        ...validMember,
        membership: {
          ...validMember.membership,
          endDate: yesterday,
        },
      });

      await expect(
        service.update(88, { status: 'CONFIRMED' }),
      ).rejects.toThrow('La membresía del socio se encuentra vencida');
    });
  });

  describe('delete', () => {
    it('throws ForbiddenError si un MEMBER intenta eliminar una reserva ajena', async () => {
      const memberUser: AuthUser = { userId: 5, role: UserRole.MEMBER };
      txMock.classBooking.findFirst.mockResolvedValue({
        id: 88,
        memberId: 10,
        classSessionId: 1,
        status: 'CONFIRMED',
        deletedAt: null,
      });
      txMock.member.findFirst.mockResolvedValue({
        id: 99,
        userId: 5,
      });

      await expect(
        service.delete(88, memberUser),
      ).rejects.toThrow(ForbiddenError);
    });

    it('elimina exitosamente la reserva propia e incrementa cupo', async () => {
      const memberUser: AuthUser = { userId: 5, role: UserRole.MEMBER };
      txMock.classBooking.findFirst.mockResolvedValue({
        id: 88,
        memberId: 10,
        classSessionId: 1,
        status: 'CONFIRMED',
        deletedAt: null,
      });
      txMock.member.findFirst.mockResolvedValue({
        id: 10,
        userId: 5,
      });
      txMock.classBooking.update.mockResolvedValue({});
      txMock.classSession.update.mockResolvedValue({});

      await service.delete(88, memberUser);

      expect(txMock.classBooking.update).toHaveBeenCalledWith({
        where: { id: 88 },
        data: expect.objectContaining({ status: 'CANCELLED' }),
      });
      expect(txMock.classSession.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { remainingCapacity: { increment: 1 } },
      });
    });
  });
});
