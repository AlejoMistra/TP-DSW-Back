import {
  type CreateRoutineInput,
  type UpdateRoutineInput,
  type RoutineResponse,
  type RoutineDetailResponse,
  RoutineDetailResponseSchema,
} from './routine.schemas.js';
import type { RoutineRepository } from './routine.repository.js';
import type { InstructorRepository } from '../instructor/instructor.repository.js';
import type { ExerciseRepository } from '../exercise/exercise.repository.js';
import {
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
} from '../../utils/errors.js';

import { type PaginatedResponse } from '../../shared/pagination.js';

export class RoutineService {
  constructor(
    private readonly repository: RoutineRepository,
    private readonly instructorRepository: InstructorRepository,
    private readonly exerciseRepository: ExerciseRepository,
  ) {}

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<RoutineResponse | RoutineDetailResponse>> {
    const [routines, total] = await Promise.all([
      this.repository.findAll(page, limit),
      this.repository.count(),
    ]);

    return {
      items: routines.map((r) => RoutineDetailResponseSchema.parse(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }


  async findOne(id: number): Promise<RoutineResponse | RoutineDetailResponse> {
    const routine = await this.repository.findOne(id);
    if (!routine) {
      throw new NotFoundError(`Routine con ID ${id} no encontrada`);
    }
    return RoutineDetailResponseSchema.parse(routine);
  }

  async create(
    input: CreateRoutineInput,
    user: { userId: number; role?: string },
  ): Promise<RoutineResponse | RoutineDetailResponse> {
    if (!user || user.role?.toLowerCase() !== 'instructor') {
      throw new UnauthorizedError('Solo instructores pueden crear rutinas');
    }

    const instructor = await this.instructorRepository.findByUserId(
      user.userId,
    );
    if (!instructor) {
      throw new NotFoundError('Instructor no encontrado');
    }

    const exercises = input.exercises ?? [];
    if (exercises.length > 0) {
      const ids = exercises.map((e) => e.exerciseId);
      const found = await this.exerciseRepository.findByIds(ids);
      const foundIds = new Set(found.map((f) => f.id));
      const missing = ids.filter((id) => !foundIds.has(id));
      if (missing.length > 0) {
        throw new NotFoundError(
          `Ejercicios no encontrados: ${missing.join(', ')}`,
        );
      }
    }

    const created = await this.repository.create({
      ...input,
      instructorId: instructor.id,
    });

    return RoutineDetailResponseSchema.parse(created);
  }

  async update(
    id: number,
    input: UpdateRoutineInput,
    user: { userId: number; role?: string },
  ): Promise<RoutineResponse | RoutineDetailResponse> {
    if (!user || user.role?.toLowerCase() !== 'instructor') {
      throw new UnauthorizedError('Solo instructores pueden modificar rutinas');
    }

    const existing = await this.repository.findOne(id);
    if (!existing) {
      throw new NotFoundError(`Routine con ID ${id} no encontrada`);
    }

    const instructor = await this.instructorRepository.findByUserId(
      user.userId,
    );
    if (!instructor) {
      throw new NotFoundError('Instructor no encontrado');
    }

    if (existing.instructorId !== instructor.id) {
      throw new ForbiddenError('No tienes permiso para modificar esta rutina');
    }

    const exercises = input.exercises;
    if (exercises && exercises.length > 0) {
      const ids = exercises.map((e) => e.exerciseId);
      const found = await this.exerciseRepository.findByIds(ids);
      const foundIds = new Set(found.map((f) => f.id));
      const missing = ids.filter((id) => !foundIds.has(id));
      if (missing.length > 0) {
        throw new NotFoundError(
          `Ejercicios no encontrados: ${missing.join(', ')}`,
        );
      }
    }

    const updated = await this.repository.update(id, input);
    return RoutineDetailResponseSchema.parse(updated);
  }

  async remove(
    id: number,
    user: { userId: number; role?: string },
  ): Promise<void> {
    if (!user || user.role?.toLowerCase() !== 'instructor') {
      throw new UnauthorizedError('Solo instructores pueden eliminar rutinas');
    }

    const existing = await this.repository.findOne(id);
    if (!existing) {
      throw new NotFoundError(`Routine con ID ${id} no encontrada`);
    }

    const instructor = await this.instructorRepository.findByUserId(
      user.userId,
    );
    if (!instructor) {
      throw new NotFoundError('Instructor no encontrado');
    }

    if (existing.instructorId !== instructor.id) {
      throw new ForbiddenError('No tienes permiso para eliminar esta rutina');
    }

    await this.repository.remove(id);
  }
}
