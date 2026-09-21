import { prisma } from '../../lib/prisma.js';
import type { Instructor, Prisma, User } from '../../generated/prisma/client.js';
import type {
  CreateInstructorInput,
  UpdateInstructorInput,
} from './instructor.schemas.js';

type DbClient = Prisma.TransactionClient | typeof prisma;

export type InstructorWithUser = Instructor & { user: User };
export type CreateInstructorData = Omit<CreateInstructorInput, 'email'> & {
  userId: number;
};
export type UpdateInstructorData = Omit<UpdateInstructorInput, 'email'>;

export class InstructorRepository {
  async getAll(): Promise<InstructorWithUser[]> {
    return prisma.instructor.findMany({
      where: { deletedAt: null },
      include: { user: true },
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