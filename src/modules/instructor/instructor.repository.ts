import { prisma } from '../../lib/prisma.js';
import type { Instructor } from '../../generated/prisma/client.js';
import type {
  CreateInstructorInput,
  UpdateInstructorInput,
} from './instructor.schemas.js';

export class InstructorRepository {
  async getAll(): Promise<Instructor[]> {
    return prisma.instructor.findMany({
      where: { deletedAt: null },
    });
  }

  async getById(id: number): Promise<Instructor | null> {
    return prisma.instructor.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findByEmail(email: string): Promise<Instructor | null> {
    return prisma.instructor.findUnique({
      where: { email },
    });
  }

  async create(input: CreateInstructorInput): Promise<Instructor> {
    return prisma.instructor.create({
      data: input,
    });
  }

  async update(
    id: number,
    input: UpdateInstructorInput,
  ): Promise<Instructor> {
    const data = {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.surname !== undefined && { surname: input.surname }),
      ...(input.email !== undefined && { email: input.email }),
      ...(input.phone !== undefined && { phone: input.phone }),
    };

    return prisma.instructor.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.instructor.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}