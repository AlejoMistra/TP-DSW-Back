import { prisma } from '../../lib/prisma.js';
import type { Routine } from '../../generated/prisma/client.js';
import type { CreateRoutineInput, UpdateRoutineInput } from './routine.schemas.js';

export class RoutineRepository {
  async findAll(page?: number, limit?: number): Promise<Routine[]> {
    const options: any = {
      orderBy: { createdAt: 'desc' },
    };
    if (typeof page === 'number' && typeof limit === 'number') {
      const take = Math.max(1, limit);
      const skip = Math.max(0, (Math.max(1, page) - 1) * take);
      options.take = take;
      options.skip = skip;
    } else if (typeof limit === 'number') {
      options.take = Math.max(1, limit);
    }
    return prisma.routine.findMany(options);
  }

  async findOne(id: number): Promise<Routine | null> {
    return prisma.routine.findUnique({
      where: { id },
    });
  }

  async create(input: CreateRoutineInput): Promise<Routine> {
    return prisma.routine.create({
      data: {
        name: input.name,
        description: input.description ?? null,
        difficulty: input.difficulty,
        instructorId: input.instructorId,
      },
    });
  }

  async update(id: number, input: UpdateRoutineInput): Promise<Routine> {
    return prisma.routine.update({
      where: { id },
      data: {
        // solo actualizamos los campos permitidos en el input
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.difficulty !== undefined ? { difficulty: input.difficulty } : {}),
      },
    });
  }

  async remove(id: number): Promise<void> {
    await prisma.routine.delete({
      where: { id },
    });
  }
}