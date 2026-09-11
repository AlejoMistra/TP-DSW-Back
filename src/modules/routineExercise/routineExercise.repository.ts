import { prisma } from '../../lib/prisma.js';
import type { RoutineExercise } from '../../generated/prisma/client.js';
import type { CreateRoutineExerciseInput, UpdateRoutineExerciseInput } from './routineExercise.schemas.js';
import { ConflictError } from '../../utils/errors.js';

export class RoutineExerciseRepository {
  async findAll(filter?: { routineId?: number }, page?: number, limit?: number): Promise<RoutineExercise[]> {
    const where: any = { deletedAt: null };
    if (filter?.routineId) where.routineId = filter.routineId;

    const options: any = { where, orderBy: { order: 'asc' } };
    if (typeof page === 'number' && typeof limit === 'number') {
      const take = Math.max(1, limit);
      const skip = Math.max(0, (Math.max(1, page) - 1) * take);
      options.take = take;
      options.skip = skip;
    } else if (typeof limit === 'number') {
      options.take = Math.max(1, limit);
    }

    return prisma.routineExercise.findMany(options);
  }

  async findOne(id: number): Promise<RoutineExercise | null> {
    return prisma.routineExercise.findFirst({ where: { id, deletedAt: null } });
  }

  async findByRoutineId(routineId: number): Promise<RoutineExercise[]> {
    return prisma.routineExercise.findMany({
      where: { routineId, deletedAt: null },
      orderBy: { order: 'asc' },
    });
  }

  async create(payload: CreateRoutineExerciseInput): Promise<RoutineExercise> {
    const { routineId, exerciseId, order = null, reps = null, sets = null, weight = null, notes = null } = payload;
    try {
      return await prisma.$transaction(async (tx) => {
        // Comprueba duplicado activo (opcional: evita agregar same exercise twice)
        const existing = await tx.routineExercise.findFirst({
          where: { routineId, exerciseId, deletedAt: null },
        });
        if (existing) throw new ConflictError('El ejercicio ya forma parte de la rutina');

        // Comprueba que routine y exercise existan (se espera que el service lo haga también)
        const routine = await tx.routine.findFirst({ where: { id: routineId, deletedAt: null } });
        if (!routine) throw new Error('Routine no encontrada');

        const exercise = await tx.exercise.findFirst({ where: { id: exerciseId, deletedAt: null } });
        if (!exercise) throw new Error('Exercise no encontrado');

        return tx.routineExercise.create({
          data: {
            routineId,
            exerciseId,
            order,
            reps,
            sets,
            weight,
            notes,
          },
        });
      });
    } catch (err: any) {
      if ((err as any)?.code === 'P2002') {
        throw new ConflictError('Conflicto de unicidad al crear routineExercise');
      }
      throw err;
    }
  }

  async update(id: number, payload: UpdateRoutineExerciseInput): Promise<RoutineExercise> {
    const data: any = {};
    if (payload.order !== undefined) data.order = payload.order;
    if (payload.reps !== undefined) data.reps = payload.reps;
    if (payload.sets !== undefined) data.sets = payload.sets;
    if (payload.weight !== undefined) data.weight = payload.weight;
    if (payload.notes !== undefined) data.notes = payload.notes;

    // No permitimos cambiar routineId/exerciseId aquí por simplicidad; si lo quisieras, agregar checks
    return prisma.routineExercise.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<void> {
    // soft-delete
    await prisma.routineExercise.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}