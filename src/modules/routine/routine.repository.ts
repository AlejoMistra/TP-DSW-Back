import { prisma } from '../../lib/prisma.js';
import type {
  Routine,
  RoutineExercise,
  Exercise,
} from '../../generated/prisma/client.js';
import type {
  CreateRoutineInput,
  UpdateRoutineInput,
} from './routine.schemas.js';
import { getPaginationParams } from '../../shared/pagination.js';

export type RoutineWithExercises = Routine & {
  routineExercises?: (RoutineExercise & { exercise?: Exercise })[];
};

export type CreateRoutineRepoInput = CreateRoutineInput & {
  instructorId: number;
};

export class RoutineRepository {
  async findAll(
    page?: number,
    limit?: number,
  ): Promise<RoutineWithExercises[]> {
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


  async findOne(id: number): Promise<RoutineWithExercises | null> {
    return prisma.routine.findFirst({
      where: { id, deletedAt: null },
      include: {
        routineExercises: {
          where: { deletedAt: null },
          orderBy: { order: 'asc' },
          include: { exercise: true },
        },
      },
    });
  }

  async create(input: CreateRoutineRepoInput): Promise<RoutineWithExercises> {
    const exercises = input.exercises ?? [];

    return prisma.$transaction(async (tx) => {
      const created = await tx.routine.create({
        data: {
          name: input.name,
          description: input.description ?? null,
          difficulty: input.difficulty,
          instructorId: input.instructorId,
        },
      });

      if (exercises.length > 0) {
        const toCreate = exercises.map((e) => ({
          routineId: created.id,
          exerciseId: e.exerciseId,
          order: e.order ?? null,
          reps: e.reps ?? null,
          sets: e.sets ?? null,
          weight: e.weight ?? null,
          notes: e.notes ?? null,
        }));

        await tx.routineExercise.createMany({ data: toCreate });
      }

      const routineWithDetails = await tx.routine.findUnique({
        where: { id: created.id },
        include: {
          routineExercises: {
            where: { deletedAt: null },
            orderBy: { order: 'asc' },
            include: { exercise: true },
          },
        },
      });

      if (!routineWithDetails) {
        throw new Error('Error al recuperar rutina recién creada');
      }

      return routineWithDetails;
    });
  }

  async update(
    id: number,
    input: UpdateRoutineInput,
  ): Promise<RoutineWithExercises> {
    const exercises = input.exercises;

    return prisma.$transaction(async (tx) => {
      await tx.routine.update({
        where: { id },
        data: {
          ...(input.name !== undefined ? { name: input.name } : {}),
          ...(input.description !== undefined
            ? { description: input.description }
            : {}),
          ...(input.difficulty !== undefined
            ? { difficulty: input.difficulty }
            : {}),
        },
      });

      if (exercises !== undefined) {
        await tx.routineExercise.deleteMany({ where: { routineId: id } });

        if (exercises.length > 0) {
          const toCreate = exercises.map((e) => ({
            routineId: id,
            exerciseId: e.exerciseId,
            order: e.order ?? null,
            reps: e.reps ?? null,
            sets: e.sets ?? null,
            weight: e.weight ?? null,
            notes: e.notes ?? null,
          }));

          await tx.routineExercise.createMany({ data: toCreate });
        }
      }

      const routineWithDetails = await tx.routine.findUnique({
        where: { id },
        include: {
          routineExercises: {
            where: { deletedAt: null },
            orderBy: { order: 'asc' },
            include: { exercise: true },
          },
        },
      });

      if (!routineWithDetails) {
        throw new Error('Error al recuperar rutina actualizada');
      }

      return routineWithDetails;
    });
  }

  async remove(id: number): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const now = new Date();
      await tx.routineExercise.updateMany({
        where: { routineId: id, deletedAt: null },
        data: { deletedAt: now },
      });
      await tx.routine.update({
        where: { id },
        data: { deletedAt: now },
      });
    });
  }
}
