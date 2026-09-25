// name=src/modules/exercise/exercise.repository.ts
import { prisma } from '../../lib/prisma.js';
import type { Exercise } from '../../generated/prisma/client.js';
import type { CreateExerciseInput, UpdateExerciseInput } from './exercise.schemas.js';
import { ConflictError } from '../../utils/errors.js';

export class ExerciseRepository {
  async findAll(options?: {
    filter?: { muscleGroup?: string; difficultyLevel?: string; name?: string };
    page?: number;
    limit?: number;
  }): Promise<Exercise[]> {
    const { filter, page, limit } = options ?? {};
    const where: any = { deletedAt: null };

    if (filter?.muscleGroup) {
      where.muscleGroup = { contains: String(filter.muscleGroup), mode: 'insensitive' };
    }
    if (filter?.difficultyLevel) {
      // normalizamos a mayúsculas para el enum de Prisma
      where.difficultyLevel = String(filter.difficultyLevel).toUpperCase();
    }
    if (filter?.name) {
      where.name = { contains: String(filter.name), mode: 'insensitive' };
    }

    const findOptions: any = { where, orderBy: { id: 'asc' } };

    if (typeof page === 'number' && typeof limit === 'number') {
      const take = Math.max(1, limit);
      const skip = Math.max(0, (Math.max(1, page) - 1) * take);
      findOptions.take = take;
      findOptions.skip = skip;
    } else if (typeof limit === 'number') {
      findOptions.take = Math.max(1, limit);
    }

    return prisma.exercise.findMany(findOptions);
  }

  async count(filter?: { muscleGroup?: string; difficultyLevel?: string; name?: string }): Promise<number> {
    const where: any = { deletedAt: null };
    if (filter?.muscleGroup) where.muscleGroup = { contains: String(filter.muscleGroup), mode: 'insensitive' };
    if (filter?.difficultyLevel) where.difficultyLevel = String(filter.difficultyLevel).toUpperCase();
    if (filter?.name) where.name = { contains: String(filter.name), mode: 'insensitive' };
    return prisma.exercise.count({ where });
  }

  async findOne(id: number): Promise<Exercise | null> {
    // findUnique doesn't allow additional conditions; usamos findFirst para excluir soft-deleted
    return prisma.exercise.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async create(exercise: CreateExerciseInput): Promise<Exercise> {
    const name = exercise.name.trim();
    const muscleGroup = exercise.muscleGroup.trim();
    const difficulty = String(exercise.difficultyLevel).toUpperCase();

    try {
      return await prisma.$transaction(async (tx) => {
        // Chequeo previo para evitar duplicados activos (soft-delete consider)
        const existing = await tx.exercise.findFirst({
          where: { name, muscleGroup, deletedAt: null },
        });
        if (existing) throw new ConflictError('Ejercicio con ese nombre y grupo muscular ya existe');

        return tx.exercise.create({
          data: {
            name,
            description: exercise.description,
            muscleGroup,
            difficultyLevel: difficulty as any,
          },
        });
      });
    } catch (err: any) {
      // Si hay condición de carrera y Prisma arroja P2002, lo transformamos a ConflictError
      if ((err as any)?.code === 'P2002') {
        throw new ConflictError('Ejercicio con ese nombre y grupo muscular ya existe');
      }
      throw err;
    }
  }

  async update(id: number, exercise: UpdateExerciseInput): Promise<Exercise> {
    const newName = exercise.name?.trim();
    const newMuscleGroup = exercise.muscleGroup?.trim();
    const newDifficulty = exercise.difficultyLevel ? String(exercise.difficultyLevel).toUpperCase() : undefined;

    try {
      return await prisma.$transaction(async (tx) => {
        // verificar existencia
        const current = await tx.exercise.findFirst({ where: { id, deletedAt: null } });
        if (!current) throw new Error('NOT_FOUND');

        // Si se modifica nombre o grupo muscular, validar conflicto con otros activos
        if (newName || newMuscleGroup) {
          const finalName = newName ?? current.name;
          const finalMuscle = newMuscleGroup ?? current.muscleGroup;

          const conflict = await tx.exercise.findFirst({
            where: { name: finalName, muscleGroup: finalMuscle, deletedAt: null, NOT: { id } },
          });
          if (conflict) throw new ConflictError('Otro ejercicio con ese nombre y grupo muscular ya existe');
        }

        return tx.exercise.update({
          where: { id },
          data: {
            ...(newName ? { name: newName } : {}),
            ...(exercise.description !== undefined ? { description: exercise.description } : {}),
            ...(newMuscleGroup ? { muscleGroup: newMuscleGroup } : {}),
            ...(newDifficulty ? { difficultyLevel: newDifficulty as any } : {}),
          },
        });
      });
    } catch (err: any) {
      if ((err as any)?.code === 'P2002') {
        throw new ConflictError('Otro ejercicio con ese nombre y grupo muscular ya existe');
      }
      throw err;
    }
  }

  async remove(id: number): Promise<void> {
    // Soft-delete: seteamos deletedAt para preservar integridad con RoutineExercise
    await prisma.exercise.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}