// name=src/modules/exercise/exercise.service.ts
import {
  type CreateExerciseInput,
  type UpdateExerciseInput,
  type ExerciseResponse,
  ExerciseResponseSchema,
} from './exercise.schemas.js';
import type { Exercise } from '../../generated/prisma/client.js';
import type { ExerciseRepository } from './exercise.repository.js';
import { NotFoundError } from '../../utils/errors.js';
import { type PaginatedResponse } from '../../shared/pagination.js';

export class ExerciseService {
  constructor(private readonly repository: ExerciseRepository) {}

  async findAll(params?: {
    filter?: { muscleGroup?: string; difficultyLevel?: string; name?: string };
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ExerciseResponse>> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const { filter } = params ?? {};
    const items = await this.repository.findAll({ filter, page, limit });
    const total = await this.repository.count(filter);

    return {
      items: items.map((e) => this.toResponse(e)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findOne(id: number): Promise<ExerciseResponse> {
    const exercise = await this.repository.findOne(id);
    if (!exercise) throw new NotFoundError(`Ejercicio con ID ${id} no encontrado`);
    return this.toResponse(exercise);
  }

  async create(payload: CreateExerciseInput): Promise<ExerciseResponse> {
    const newExercise = await this.repository.create(payload);
    return this.toResponse(newExercise);
  }

  async update(id: number, payload: UpdateExerciseInput): Promise<ExerciseResponse> {
    const existing = await this.repository.findOne(id);
    if (!existing) throw new NotFoundError(`Ejercicio con ID ${id} no encontrado`);
    const updated = await this.repository.update(id, payload);
    return this.toResponse(updated);
  }

  async remove(id: number): Promise<void> {
    const existing = await this.repository.findOne(id);
    if (!existing) throw new NotFoundError(`Ejercicio con ID ${id} no encontrado`);
    await this.repository.remove(id);
  }

  private toResponse(e: Exercise): ExerciseResponse {
    return ExerciseResponseSchema.parse(e);
  }
}