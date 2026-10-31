import { prisma } from '../../lib/prisma.js';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '../../utils/errors.js';
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

import { type PaginatedResponse } from '../../shared/pagination.js';

export class InstructorService {
  constructor(
    private readonly repository: InstructorRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getAll(
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<InstructorResponse>> {
    const [instructors, total] = await Promise.all([
      this.repository.getAll(page, limit),
      this.repository.count(),
    ]);

    return {
      items: instructors.map((instructor) => this.toResponse(instructor)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async getById(id: number): Promise<InstructorResponse> {
    const instructor = await this.repository.getById(id);

    if (!instructor) {
      throw new NotFoundError(`Instructor con ID ${id} no encontrado`);
    }

    return this.toResponse(instructor);
  }

  async getMe(userId: number): Promise<InstructorResponse> {
    const instructor = await this.repository.findByUserId(userId);
    if (!instructor) {
      throw new NotFoundError(
        `Instructor no encontrado para el usuario actual`,
      );
    }

    return this.toResponse(instructor);
  }

  async create(input: CreateInstructorInput): Promise<InstructorResponse> {
    const existingInstructorByDoc = await this.repository.findByDocWithDeleted(
      input.docType,
      input.docNumber,
    );

    if (existingInstructorByDoc) {
      if (existingInstructorByDoc.deletedAt !== null) {
        throw new ConflictError(
          `El documento pertenece al profesor dado de baja ${existingInstructorByDoc.name} ${existingInstructorByDoc.surname}`,
          'INACTIVE_INSTRUCTOR_EXISTS',
          {
            instructorId: existingInstructorByDoc.id,
            name: existingInstructorByDoc.name,
            surname: existingInstructorByDoc.surname,
            docType: existingInstructorByDoc.docType,
            docNumber: existingInstructorByDoc.docNumber,
          },
        );
      }
      throw new ConflictError('Ya existe un profesor activo con ese documento');
    }

    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser && existingUser.deletedAt === null) {
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
          docType: input.docType,
          docNumber: input.docNumber,
          userId: newUser.id,
        },
        tx,
      );
    });

    return this.toResponse(createdInstructor);
  }

  async reactivate(
    id: number,
    input: CreateInstructorInput,
  ): Promise<InstructorResponse> {
    const existingInstructor = await this.repository.getByIdWithDeleted(id);
    if (!existingInstructor) {
      throw new NotFoundError(`Instructor con ID ${id} no encontrado`);
    }

    if (existingInstructor.deletedAt === null) {
      throw new BadRequestError(
        'El profesor ya se encuentra activo en el sistema',
      );
    }

    if (input.email !== existingInstructor.user.email) {
      const emailUser = await this.userRepository.findByEmail(input.email);
      if (
        emailUser &&
        emailUser.deletedAt === null &&
        emailUser.id !== existingInstructor.userId
      ) {
        throw new ConflictError('Email ya registrado');
      }
    }

    const { email, ...instructorData } = input;

    const reactivated = await prisma.$transaction(async (tx) => {
      await this.userRepository.update(
        existingInstructor.userId,
        {
          email,
          passwordHash: null,
          accountStatus: 'PENDING_ACTIVATION',
          role: 'INSTRUCTOR',
          isActive: true,
          deletedAt: null,
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
        tx,
      );

      return this.repository.update(
        id,
        {
          ...instructorData,
          docType: input.docType,
          docNumber: input.docNumber,
          deletedAt: null,
        },
        tx,
      );
    });

    return this.toResponse(reactivated);
  }

  async update(
    id: number,
    input: UpdateInstructorInput,
  ): Promise<InstructorResponse> {
    const existing = await this.repository.getById(id);

    if (!existing) {
      throw new NotFoundError(`Instructor con ID ${id} no encontrado`);
    }

    const { email, ...instructorData } = input;

    if (email !== undefined && email !== existing.user.email) {
      const instructorWithEmail = await this.userRepository.findByEmail(email);

      if (
        instructorWithEmail &&
        instructorWithEmail.deletedAt === null &&
        instructorWithEmail.id !== existing.userId
      ) {
        throw new ConflictError('Email ya registrado');
      }
    }

    if (
      instructorData.docNumber !== undefined &&
      (instructorData.docNumber !== existing.docNumber ||
        (instructorData.docType !== undefined &&
          instructorData.docType !== existing.docType))
    ) {
      const docTypeToCheck = instructorData.docType ?? existing.docType;
      const existingInstructorDoc = await this.repository.findByDoc(
        docTypeToCheck,
        instructorData.docNumber,
      );
      if (existingInstructorDoc && existingInstructorDoc.id !== id) {
        throw new ConflictError(
          'Ya existe otro profesor registrado con ese documento',
        );
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
      throw new NotFoundError(`Instructor con ID ${id} no encontrado`);
    }

    await prisma.$transaction(async (tx) => {
      await this.repository.delete(id, tx);
      await this.userRepository.delete(existing.userId, tx);
    });
  }

  private toResponse(instructor: InstructorWithUser): InstructorResponse {
    const { user, ...instructorFields } = instructor;
    return InstructorResponseSchema.parse({
      ...instructorFields,
      email: user.email,
    });
  }
}
