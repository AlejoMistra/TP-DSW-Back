import { prisma } from '../../lib/prisma.js';
import type { CreateClassBookingInput, UpdateClassBookingInput } from './classBooking.schemas.js';
import type { ClassBooking } from '../../generated/prisma/client.js';

export class ClassBookingRepository {
  async getAll(): Promise<ClassBooking[]> {
    return prisma.classBooking.findMany({
      where: { deletedAt: null },
    });
  }

  async getById(id: number): Promise<ClassBooking | null> {
    return prisma.classBooking.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async create(classBooking: CreateClassBookingInput): Promise<ClassBooking> {
    return prisma.classBooking.create({
      data: {
        member: { connect: { id: classBooking.memberId } },
        classSession: { connect: { id: classBooking.classSessionId } },
      },
    });
  }

  async update(id: number, classBooking: UpdateClassBookingInput): Promise<ClassBooking> {
    return prisma.classBooking.update({
      where: { id },
      data: {
        status: classBooking.status,
      },
    });
  }

  async delete(id: number): Promise<ClassBooking> {
    return prisma.classBooking.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}