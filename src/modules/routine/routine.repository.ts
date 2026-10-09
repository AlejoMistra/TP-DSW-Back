import { prisma } from '../../lib/prisma.js';
import type { Routine } from '../../generated/prisma/client.js';
import type { CreateRoutineInput, UpdateRoutineInput } from './routine.schemas.js';
import { getPaginationParams } from '../../shared/pagination.js';

export class RoutineRepository {
  async findAll(page?: number, limit?: number): Promise<Routine[]> {
    const { take, skip } = getPaginationParams(page, limit);
    return prisma.routine.findMany({
      where: { deletedAt: null },
      take,
      skip,
      orderBy: { createdAt: 'desc' },
      include: {
        routineExercises: {
          where: { deletedAt: null },
          orderBy: { order: 'asc' },
          include: { exercise: true },
        },
      },
    });
  }

  async count(): Promise<number> {
    return prisma.routine.count({
      where: { deletedAt: null },
    });
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