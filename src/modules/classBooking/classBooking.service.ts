import {
  CreateClassBookingInput,
  UpdateClassBookingInput,
  ClassBookingResponse,
  ClassBookingResponseSchema,
} from './classBooking.schemas.js';
import { Prisma, type ClassBooking } from '../../generated/prisma/client.js';
import { ClassBookingRepository } from './classBooking.repository.js';
import { prisma } from '../../lib/prisma.js';
import { NotFoundError, ConflictError } from '../../utils/errors.js';

export class ClassBookingService {
  constructor(private readonly repository: ClassBookingRepository) {}

  async getAll(): Promise<ClassBookingResponse[]> {
    const classBookings = await this.repository.getAll();
    return classBookings.map((classBooking) => this.toResponse(classBooking));
  }

  async getById(id: number): Promise<ClassBookingResponse> {
    const classBooking = await this.repository.getById(id);
    if (!classBooking) throw new NotFoundError(`Asistencia a clase con ID ${id} no encontrada`);
    return this.toResponse(classBooking);
  }

  async create(input: CreateClassBookingInput): Promise<ClassBookingResponse> {
    try {
      const created = await prisma.$transaction(async (tx) => {
        // 1) Session válida
        const session = await tx.classSession.findFirst({
          where: {
            id: input.classSessionId,
            deletedAt: null,
            status: 'SCHEDULED',
          },
        });

        if (!session) throw new NotFoundError('Sesión de clase no encontrada o no disponible');

        // 2) Buscar reserva previa (incluso cancelada o con soft-delete)
        const existingBooking = await tx.classBooking.findFirst({
          where: {
            memberId: input.memberId,
            classSessionId: input.classSessionId,
          },
        });

        if (existingBooking && existingBooking.status === 'CONFIRMED' && existingBooking.deletedAt === null) {
          throw new ConflictError('El socio ya tiene una reserva para esta clase');
        }

        // 3) Cupo
        if (session.remainingCapacity <= 0) {
          throw new ConflictError('No hay cupos disponibles');
        }

        // 4) Si ya existía cancelada o soft-deleted, reactivarla
        if (existingBooking) {
          const reactivated = await tx.classBooking.update({
            where: { id: existingBooking.id },
            data: {
              status: 'CONFIRMED',
              deletedAt: null,
              bookingDate: new Date(),
            },
          });

          await tx.classSession.update({
            where: { id: input.classSessionId },
            data: { remainingCapacity: { decrement: 1 } },
          });

          return reactivated;
        }

        // 5) Crear nueva reserva + descontar cupo
        const booking = await tx.classBooking.create({
          data: {
            memberId: input.memberId,
            classSessionId: input.classSessionId,
            status: 'CONFIRMED',
            bookingDate: new Date(),
          },
        });

        await tx.classSession.update({
          where: { id: input.classSessionId },
          data: { remainingCapacity: { decrement: 1 } },
        });

        return booking;
      });

      return this.toResponse(created);
    } catch (error) {
      // Respaldo por concurrencia (unique memberId+classSessionId)
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictError('El socio ya tiene una reserva para esta clase');
      }
      throw error;
    }
  }

  async update(id: number, input: UpdateClassBookingInput): Promise<ClassBookingResponse> {
    const updated = await prisma.$transaction(async (tx) => {
      const existing = await tx.classBooking.findFirst({
        where: { id },
      });
      if (!existing) throw new NotFoundError(`Asistencia a clase con ID ${id} no encontrada`);

      // Si no hay cambio de estado y no está soft-deleted, devolver existente
      if (existing.status === input.status && existing.deletedAt === null) return existing;

      if (input.status === 'CANCELLED') {
        if (existing.status === 'CONFIRMED') {
          const booking = await tx.classBooking.update({
            where: { id },
            data: { status: 'CANCELLED' },
          });

          await tx.classSession.update({
            where: { id: existing.classSessionId },
            data: { remainingCapacity: { increment: 1 } },
          });

          return booking;
        }

        return existing;
      }

      if (input.status === 'CONFIRMED') {
        // Reactivación si estaba cancelada o soft-deleted
        const session = await tx.classSession.findFirst({
          where: { id: existing.classSessionId, deletedAt: null, status: 'SCHEDULED' },
        });
        if (!session) throw new NotFoundError('Sesión de clase no encontrada o no disponible');
        if (session.remainingCapacity <= 0) throw new ConflictError('No hay cupos disponibles');

        const booking = await tx.classBooking.update({
          where: { id },
          data: {
            status: 'CONFIRMED',
            deletedAt: null,
            bookingDate: new Date(),
          },
        });

        await tx.classSession.update({
          where: { id: existing.classSessionId },
          data: { remainingCapacity: { decrement: 1 } },
        });

        return booking;
      }

      return existing;
    });

    return this.toResponse(updated);
  }

  async delete(id: number): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.classBooking.findFirst({ where: { id } });

      if (!existing || existing.deletedAt) {
        throw new NotFoundError(`Asistencia a clase con ID ${id} no encontrada`);
      }

      if (existing.status === 'CANCELLED') {
        throw new ConflictError('La reserva ya está cancelada');
      }

      await tx.classBooking.update({
        where: { id },
        data: { deletedAt: new Date(), status: 'CANCELLED' },
      });

      await tx.classSession.update({
        where: { id: existing.classSessionId },
        data: { remainingCapacity: { increment: 1 } },
      });
    });
  }

  private toResponse(classBooking: ClassBooking): ClassBookingResponse {
    return ClassBookingResponseSchema.parse({
      id: classBooking.id,
      memberId: classBooking.memberId,
      classSessionId: classBooking.classSessionId,
      bookingDate: classBooking.bookingDate,
      status: classBooking.status,
      createdAt: classBooking.createdAt,
      updatedAt: classBooking.updatedAt,
      deletedAt: classBooking.deletedAt,
    });
  }
}