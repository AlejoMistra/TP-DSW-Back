import type { Instructor } from '../../generated/prisma/client.js';
import { ConflictError, NotFoundError } from '../../utils/errors.js';
import { InstructorRepository } from './instructor.repository.js';
import {
  CreateInstructorInput,
  InstructorResponse,
  InstructorResponseSchema,
  UpdateInstructorInput,
} from './instructor.schemas.js';

export class InstructorService {
  constructor(
    private readonly repository: InstructorRepository,
  ) {}

  async getAll(): Promise<InstructorResponse[]> {
    const instructors = await this.repository.getAll();

    return instructors.map((instructor) =>
      this.toResponse(instructor),
    );
  }

  async getById(id: number): Promise<InstructorResponse> {
    const instructor = await this.repository.getById(id);

    if (!instructor) {
      throw new NotFoundError(
        `Instructor con ID ${id} no encontrado`,
      );
    }

    return this.toResponse(instructor);
  }

  async create(
    input: CreateInstructorInput,
  ): Promise<InstructorResponse> {
    const existing = await this.repository.findByEmail(input.email);

    if (existing) {
      throw new ConflictError('Email ya registrado');
    }

    const instructor = await this.repository.create(input);

    return this.toResponse(instructor);
  }

  async update(
    id: number,
    input: UpdateInstructorInput,
  ): Promise<InstructorResponse> {
    const existing = await this.repository.getById(id);

    if (!existing) {
      throw new NotFoundError(
        `Instructor con ID ${id} no encontrado`,
      );
    }

    if (
      input.email !== undefined &&
      input.email !== existing.email
    ) {
      const instructorWithEmail =
        await this.repository.findByEmail(input.email);

      if (instructorWithEmail) {
        throw new ConflictError('Email ya registrado');
      }
    }

    const updatedInstructor = await this.repository.update(id, input);

    return this.toResponse(updatedInstructor);
  }

  async delete(id: number): Promise<void> {
    const existing = await this.repository.getById(id);

    if (!existing) {
      throw new NotFoundError(
        `Instructor con ID ${id} no encontrado`,
      );
    }

    await this.repository.delete(id);
  }

  private toResponse(
    instructor: Instructor,
  ): InstructorResponse {
    return InstructorResponseSchema.parse(instructor);
  }
}