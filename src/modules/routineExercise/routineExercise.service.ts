import {
  type CreateRoutineExerciseInput,
  type UpdateRoutineExerciseInput,
  type RoutineExerciseResponse,
  RoutineExerciseResponseSchema,
} from './routineExercise.schemas.js';
import type { RoutineExercise, Routine } from '../../generated/prisma/client.js';
import type { RoutineExerciseRepository } from './routineExercise.repository.js';
import { NotFoundError, UnauthorizedError } from '../../utils/errors.js';
import { prisma } from '../../lib/prisma.js';

export class RoutineExerciseService {
  constructor(private readonly repository: RoutineExerciseRepository) {}

  async findAll(routineId?: number, page?: number, limit?: number) {
    const items = await this.repository.findAll(routineId ? { routineId } : undefined, page, limit);
    return items.map((i) => this.toResponse(i));
  }

  async findOne(id: number) {
    const re = await this.repository.findOne(id);
    if (!re) throw new NotFoundError(`RoutineExercise con ID ${id} no encontrado`);
    return this.toResponse(re);
  }

  async findByRoutine(routineId: number) {
    const items = await this.repository.findByRoutineId(routineId);
    return items.map((i) => this.toResponse(i));
  }

  // userId and role are used to validate permissions (expects req.user)
  async create(payload: CreateRoutineExerciseInput, user: { id: number; role?: string }) {
    // permiso: solo instructores
    if (!user || user.role !== 'instructor') throw new UnauthorizedError('Solo instructores pueden agregar ejercicios a rutinas');

    // comprobar routine y ownership: sólo instructor propietario puede modificar su rutina
    const routine = await prisma.routine.findFirst({ where: { id: payload.routineId, deletedAt: null } });
    if (!routine) throw new NotFoundError('Routine no encontrada');
    if (routine.instructorId !== user.id) throw new UnauthorizedError('No sos propietario de la rutina');

    // comprobar exercise existe
    const exercise = await prisma.exercise.findFirst({ where: { id: payload.exerciseId, deletedAt: null } });
    if (!exercise) throw new NotFoundError('Exercise no encontrado');

    const created = await this.repository.create(payload);
    return this.toResponse(created);
  }

  async update(id: number, payload: UpdateRoutineExerciseInput, user: { id: number; role?: string }) {
    // comprobar existencia y permisos (ownership via routine)
    const existing = await prisma.routineExercise.findFirst({ where: { id, deletedAt: null }, include: { routine: true } });
    if (!existing) throw new NotFoundError(`RoutineExercise con ID ${id} no encontrado`);

    if (!user || user.role !== 'instructor') throw new UnauthorizedError('Solo instructores pueden modificar ejercicios en rutinas');
    if (existing.routine.instructorId !== user.id) throw new UnauthorizedError('No sos propietario de la rutina');

    const updated = await this.repository.update(id, payload);
    return this.toResponse(updated);
  }

  async remove(id: number, user: { id: number; role?: string }) {
    const existing = await prisma.routineExercise.findFirst({ where: { id, deletedAt: null }, include: { routine: true } });
    if (!existing) throw new NotFoundError(`RoutineExercise con ID ${id} no encontrado`);
    if (!user || user.role !== 'instructor') throw new UnauthorizedError('Solo instructores pueden eliminar ejercicios de rutinas');
    if (existing.routine.instructorId !== user.id) throw new UnauthorizedError('No sos propietario de la rutina');

    await this.repository.remove(id);
  }

  private toResponse(re: RoutineExercise): RoutineExerciseResponse {
    return RoutineExerciseResponseSchema.parse(re);
  }
}