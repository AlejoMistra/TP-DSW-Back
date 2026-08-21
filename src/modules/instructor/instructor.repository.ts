import { prisma } from '../../lib/prisma.js';
import { Instructor } from '../../generated/prisma/client.js';
import {
  CreateInstructorInput,
  UpdateInstructorInput,
} from './instructor.schemas.js';

export class InstructorRepository {
  async getAll(): Promise<Instructor[]> {
    return await prisma.instructor.findMany({
      where: { deletedAt: null },
    });
  }

  async getById(id: number): Promise<Instructor | undefined> {
    const instructor = await prisma.instructor.findFirst({
      where: { id, deletedAt: null },
    });
    return instructor ?? undefined;
  }

  async add(props: CreateInstructorInput): Promise<Instructor> {
    const existing = await prisma.instructor.findUnique({
      where: { email: props.email },
    });
    if (existing) {
      throw new Error('Email ya registrado');
    }
    return await prisma.instructor.create({
      data: props,
    });
  }

  // TODO: Because UpdateInstructorInput is partial, this update currently passes undefined for omitted fields (and coerces phoneNumber to null when phone is not provided). This can cause Prisma validation errors and/or unintentionally clear fields on partial updates. Build the data object to include only keys that are actually provided (and only set phoneNumber to null when the caller explicitly sends phone: null). Also, catching all errors and returning undefined hides non-not-found problems (e.g., unique constraint violations); prefer letting Prisma errors bubble up (and map them in a higher layer) or translating them into a specific error type.

  async update(
    id: number,
    props: UpdateInstructorInput,
  ): Promise<Instructor | undefined> {
    return prisma.instructor.update({
      where: { id },
      data: {
        name: props.name,
        surname: props.surname,
        email: props.email,
        phone: props.phone ?? null,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.instructor.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
