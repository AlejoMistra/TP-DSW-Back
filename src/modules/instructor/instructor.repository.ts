import { prisma } from '../../lib/prisma.js';
import type { docType, Instructor, Prisma, User } from '../../generated/prisma/client.js';
import type {
  CreateInstructorInput,
  UpdateInstructorInput,
} from './instructor.schemas.js';

type DbClient = Prisma.TransactionClient | typeof prisma;

export type InstructorWithUser = Instructor & { user: User };
export type CreateInstructorData = Omit<CreateInstructorInput, 'email'> & {
  userId: number;
};
export type UpdateInstructorData = Partial<Omit<UpdateInstructorInput, 'email'>> & {
  deletedAt?: Date | null;
};

import { getPaginationParams } from '../../shared/pagination.js';

export class InstructorRepository {
  async getAll(page?: number, limit?: number): Promise<InstructorWithUser[]> {
    const { take, skip } = getPaginationParams(page, limit);
    return prisma.instructor.findMany({
      where: { deletedAt: null },
      take,
      skip,
      include: { user: true },
    });
  }

  async count(): Promise<number> {
    return prisma.instructor.count({
      where: { deletedAt: null },
    });
  }

  async getById(id: number): Promise<InstructorWithUser | null> {
    return prisma.instructor.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: { user: true },
    });
  }

  async findByUserId(userId: number): Promise<InstructorWithUser | null> {
    return prisma.instructor.findFirst({
      where: {
        userId,
        deletedAt: null,
      },
      include: { user: true },
    });
  }

  async getByUserIdWithDeleted(
    userId: number,
    db: DbClient = prisma,
  ): Promise<InstructorWithUser | null> {
    return db.instructor.findFirst({
      where: { userId },
      include: { user: true },
    });
  }

  async findByDoc(
    docType: docType,
    docNumber: string,
    db: DbClient = prisma,
  ): Promise<InstructorWithUser | null> {
    return db.instructor.findFirst({
      where: {
        docType,
        docNumber,
        deletedAt: null,
      },
      include: { user: true },
    });
  }

  async findByDocWithDeleted(
    docType: docType,
    docNumber: string,
    db: DbClient = prisma,
  ): Promise<InstructorWithUser | null> {
    return db.instructor.findFirst({
      where: {
        docType,
        docNumber,
      },
      include: { user: true },
    });
  }

  async findByEmail(email: string): Promise<InstructorWithUser | null> {
    return prisma.instructor.findFirst({
      where: {
        deletedAt: null,
        user: { email },
      },
      include: { user: true },
    });
  }

  async create(
    input: CreateInstructorData,
    db: DbClient = prisma,
  ): Promise<InstructorWithUser> {
    return db.instructor.create({
      data: input,
      include: { user: true },
    });
  }

  async update(
    id: number,
    input: UpdateInstructorData,
    db: DbClient = prisma,
  ): Promise<InstructorWithUser> {
    return db.instructor.update({
      where: { id },
      data: input,
      include: { user: true },
    });
  }

  async delete(id: number, db: DbClient = prisma): Promise<void> {
    await db.instructor.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}