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

  async getOne(id: number): Promise<Instructor | undefined> {
    const instructor = await prisma.instructor.findUnique({
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

  async update(
    id: number,
    props: UpdateInstructorInput,
  ): Promise<Instructor | undefined> {
    try {
      return await prisma.instructor.update({
        where: { id },
        data: {
          name: props.name,
          surname: props.surname,
          email: props.email,
          phoneNumber: props.phone ?? null,
        },
      });
    } catch (error) {
      return undefined;
    }
  }

  async delete(id: number): Promise<void> {
    await prisma.instructor.delete({
      where: { id },
    });
  }
}
