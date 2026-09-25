import { prisma } from '../../lib/prisma.js';
import { ConflictError, NotFoundError } from '../../utils/errors.js';
import {
  InstructorRepository,
  InstructorWithUser,
} from './instructor.repository.js';
import { UserRepository } from '../user/user.repository.js';
import {
  CreateInstructorInput,
  InstructorResponse,
  InstructorResponseSchema,
  UpdateInstructorInput,
} from './instructor.schemas.js';

export class InstructorService {
  constructor(
    private readonly repository: InstructorRepository,
    private readonly userRepository: UserRepository,
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
    const existing = await this.userRepository.findByEmail(input.email);

    if (existing) {
      throw new ConflictError('Email ya registrado');
    }

    const { email, ...instructorData } = input;

    const createdInstructor = await prisma.$transaction(async (tx) => {
      const newUser = await this.userRepository.add(
        {
          email,
          passwordHash: null,
          accountStatus: 'PENDING_ACTIVATION',
          role: 'INSTRUCTOR',
          isActive: true,
        },
        tx,
      );

      return this.repository.create(
        {
          ...instructorData,
          userId: newUser.id,
        },
        tx,
      );
    });

    return this.toResponse(createdInstructor);
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

    const { email, ...instructorData } = input;

    if (email !== undefined && email !== existing.user.email) {
      const instructorWithEmail =
        await this.userRepository.findByEmail(email);

      if (instructorWithEmail) {
        throw new ConflictError('Email ya registrado');
      }
    }

    const updatedInstructor = await prisma.$transaction(async (tx) => {
      if (email !== undefined && email !== existing.user.email) {
        await this.userRepository.update(existing.userId, { email }, tx);
      }

      return this.repository.update(id, instructorData, tx);
    });

    return this.toResponse(updatedInstructor);
  }

  async delete(id: number): Promise<void> {
    const existing = await this.repository.getById(id);

    if (!existing) {
      throw new NotFoundError(
        `Instructor con ID ${id} no encontrado`,
      );
    }

    await prisma.$transaction(async (tx) => {
      await this.repository.delete(id, tx);
      await this.userRepository.delete(existing.userId, tx);
    });
  }

  private toResponse(
    instructor: InstructorWithUser,
  ): InstructorResponse {
    const { user, ...instructorFields } = instructor;
    return InstructorResponseSchema.parse({
      ...instructorFields,
      email: user.email,
    });
  }
}