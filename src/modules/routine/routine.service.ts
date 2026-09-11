import {
  type CreateRoutineInput,
  type UpdateRoutineInput,
  type RoutineResponse,
  type RoutineDetailResponse,
  RoutineResponseSchema,
  RoutineDetailResponseSchema,
} from './routine.schemas.js';
import type { Routine } from '../../generated/prisma/client.js';
import type { RoutineRepository } from './routine.repository.js';
import { prisma } from '../../lib/prisma.js';
import { NotFoundError, UnauthorizedError } from '../../utils/errors.js';

export class RoutineService {
  constructor(private readonly repository: RoutineRepository) { }

  async findAll(page?: number, limit?: number): Promise<(RoutineResponse | RoutineDetailResponse)[]> {
    const routines = await this.repository.findAll(page, limit);
    return routines.map((r) => RoutineDetailResponseSchema.parse(r));
  }


  // Devuelve la rutina con routineExercises y el exercise anidado
  async findOne(id: number): Promise<RoutineResponse | RoutineDetailResponse> {
    // Obtener la rutina directamente incluyendo la relación intermedia y el exercise
    const routineWithExercises = await prisma.routine.findUnique({
      where: { id },
      include: {
        routineExercises: {
          where: { deletedAt: null },
          orderBy: { order: 'asc' },
          include: { exercise: true }, // <-- datos completos del exercise
        },
      },
    });

    if (!routineWithExercises) {
      throw new NotFoundError(`Routine con ID ${id} no encontrada`);
    }

    // RoutineDetailResponseSchema admite routineExercises con exercise anidado
    return RoutineDetailResponseSchema.parse(routineWithExercises as Routine & { routineExercises?: any[] });
  }

  async create(input: CreateRoutineInput, user: { id: number; role?: string }): Promise<RoutineResponse | RoutineDetailResponse> {
    if (!user || user.role !== 'instructor') {
      throw new UnauthorizedError('Solo instructores pueden crear rutinas');
    }

    const instr = await prisma.instructor.findUnique({ where: { id: input.instructorId } });
    if (!instr) throw new NotFoundError('Instructor no encontrado');

    const exercises = input.exercises ?? [];
    if (exercises.length > 0) {
      const ids = exercises.map((e) => e.exerciseId);
      const found = await prisma.exercise.findMany({ where: { id: { in: ids } }, select: { id: true } });
      const foundIds = new Set(found.map((f) => f.id));
      const missing = ids.filter((id) => !foundIds.has(id));
      if (missing.length) throw new NotFoundError(`Exercises no encontrados: ${missing.join(',')}`);
    }

    // Crear routine + routineExercises en transacción (atómico)
    const created = await prisma.$transaction(async (tx) => {
      const r = await tx.routine.create({
        data: {
          name: input.name,
          description: input.description ?? null,
          difficulty: input.difficulty,
          instructorId: input.instructorId,
        },
      });

      if (exercises.length > 0) {
        const toCreate = exercises.map((e) => ({
          routineId: r.id,
          exerciseId: e.exerciseId,
          order: e.order ?? null,
          reps: e.reps ?? null,
          sets: e.sets ?? null,
          weight: e.weight ?? null,
          notes: e.notes ?? null,
        }));

        // createMany no retorna rows; re-fetch abajo
        await tx.routineExercise.createMany({ data: toCreate });
      }

      return tx.routine.findUnique({
        where: { id: r.id },
        include: {
          routineExercises: {
            where: { deletedAt: null },
            orderBy: { order: 'asc' },
            include: { exercise: true },
          },
        },
      });
    });

    if (!created) throw new Error('Error al crear rutina');
    return RoutineDetailResponseSchema.parse(created as Routine & { routineExercises?: any[] });
  }

  async update(id: number, input: UpdateRoutineInput, user: { id: number; role?: string }): Promise<RoutineResponse | RoutineDetailResponse> {
    const existing = await this.repository.findOne(id);
    if (!existing) throw new NotFoundError(`Routine con ID ${id} no encontrada`);

    if (!user || user.role !== 'instructor') throw new UnauthorizedError('Solo instructores pueden modificar rutinas');
    //if (existing.instructorId !== user.id) throw new UnauthorizedError('No sos propietario de la rutina');

    const exercises = (input as any).exercises as Array<any> | undefined;
    if (exercises && exercises.length > 0) {
      const ids = exercises.map((e) => e.exerciseId);
      const found = await prisma.exercise.findMany({ where: { id: { in: ids } }, select: { id: true } });
      const foundIds = new Set(found.map((f) => f.id));
      const missing = ids.filter((id) => !foundIds.has(id));
      if (missing.length) throw new NotFoundError(`Exercises no encontrados: ${missing.join(',')}`);
    }

    const updated = await prisma.$transaction(async (tx) => {
      await tx.routine.update({
        where: { id },
        data: {
          ...(input.name !== undefined ? { name: input.name } : {}),
          ...(input.description !== undefined ? { description: input.description } : {}),
          ...(input.difficulty !== undefined ? { difficulty: input.difficulty } : {}),
        },
      });

      if (exercises) {
        // Reemplazo completo: borramos los actuales y creamos los suministrados
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

      return tx.routine.findUnique({
        where: { id },
        include: {
          routineExercises: {
            where: { deletedAt: null },
            orderBy: { order: 'asc' },
            include: { exercise: true },
          },
        },
      });
    });

    if (!updated) throw new Error('Error al actualizar rutina');
    return RoutineDetailResponseSchema.parse(updated as Routine & { routineExercises?: any[] });
  }

  async remove(id: number, user: { id: number; role?: string }): Promise<void> {
    const existing = await this.repository.findOne(id);
    if (!existing) throw new NotFoundError(`Routine con ID ${id} no encontrada`);

    if (!user || user.role !== 'instructor') throw new UnauthorizedError('Solo instructores pueden eliminar rutinas');
    //if (existing.instructorId !== user.id) throw new UnauthorizedError('No sos propietario de la rutina');

    // Borrado en transacción: eliminar routineExercises y luego la rutina
    await prisma.$transaction([
      prisma.routineExercise.deleteMany({ where: { routineId: id } }),
      prisma.routine.delete({ where: { id } }),
    ]);
  }

  private toResponse(routine: Routine & { routineExercises?: any[] }): RoutineResponse | RoutineDetailResponse {
    // Si viene con routineExercises usamos el schema de detalle (incluye reps/sets/order y el exercise anidado)
    if (Array.isArray((routine as any).routineExercises)) {
      return RoutineDetailResponseSchema.parse(routine);
    }
    return RoutineResponseSchema.parse(routine);
  }
}