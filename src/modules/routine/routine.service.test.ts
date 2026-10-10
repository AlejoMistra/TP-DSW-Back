import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RoutineService } from './routine.service.js';
import type {
  RoutineRepository,
  RoutineWithExercises,
} from './routine.repository.js';
import type {
  InstructorRepository,
  InstructorWithUser,
} from '../instructor/instructor.repository.js';
import type { ExerciseRepository } from '../exercise/exercise.repository.js';
import {
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
} from '../../utils/errors.js';
import type { Exercise } from '../../generated/prisma/client.js';

function buildRoutine(
  overrides: Partial<RoutineWithExercises> = {},
): RoutineWithExercises {
  return {
    id: 1,
    name: 'Rutina Hipertrofia',
    description: 'Enfoque en pecho y bíceps',
    difficulty: 'INTERMEDIATE',
    instructorId: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    routineExercises: [],
    ...overrides,
  };
}

function buildInstructor(
  overrides: Partial<InstructorWithUser> = {},
): InstructorWithUser {
  return {
    id: 10,
    name: 'Carlos',
    surname: 'Entrenador',
    phone: '123456789',
    docType: 'DNI',
    docNumber: '12345678',
    joinDate: new Date(),
    userId: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    user: {
      id: 5,
      email: 'instructor@gym.com',
      passwordHash: 'hash',
      accountStatus: 'ACTIVE',
      role: 'INSTRUCTOR',
      isActive: true,
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    ...overrides,
  };
}

describe('RoutineService', () => {
  let routineRepository: {
    [K in keyof RoutineRepository]: ReturnType<typeof vi.fn>;
  };
  let instructorRepository: {
    [K in keyof InstructorRepository]: ReturnType<typeof vi.fn>;
  };
  let exerciseRepository: {
    [K in keyof ExerciseRepository]: ReturnType<typeof vi.fn>;
  };
  let service: RoutineService;

  beforeEach(() => {
    routineRepository = {
      findAll: vi.fn(),
      count: vi.fn(),
      findOne: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    };
    instructorRepository = {
      getAll: vi.fn(),
      count: vi.fn(),
      getById: vi.fn(),
      findByUserId: vi.fn(),
      findByEmail: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    exerciseRepository = {
      findAll: vi.fn(),
      count: vi.fn(),
      findOne: vi.fn(),
      findByIds: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    };

    service = new RoutineService(
      routineRepository as unknown as RoutineRepository,
      instructorRepository as unknown as InstructorRepository,
      exerciseRepository as unknown as ExerciseRepository,
    );
  });

  describe('findAll', () => {
    it('devuelve las rutinas paginadas con el schema de detalle', async () => {
      routineRepository.findAll.mockResolvedValue([
        buildRoutine(),
        buildRoutine({ id: 2, name: 'Rutina Pierna' }),
      ]);
      routineRepository.count.mockResolvedValue(2);

      const result = await service.findAll(1, 10);

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(result.items[0].id).toBe(1);
      expect(result.items[1].id).toBe(2);
      expect(routineRepository.findAll).toHaveBeenCalledWith(1, 10);
      expect(routineRepository.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('lanza NotFoundError si la rutina no existe', async () => {
      routineRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundError);
    });

    it('devuelve la rutina encontrada', async () => {
      routineRepository.findOne.mockResolvedValue(buildRoutine({ id: 5 }));

      const result = await service.findOne(5);

      expect(result.id).toBe(5);
      expect(routineRepository.findOne).toHaveBeenCalledWith(5);
    });
  });

  describe('create', () => {
    it('lanza UnauthorizedError si el usuario no tiene rol INSTRUCTOR', async () => {
      await expect(
        service.create(
          { name: 'Rutina', difficulty: 'BEGINNER' },
          { userId: 5, role: 'MEMBER' },
        ),
      ).rejects.toThrow(UnauthorizedError);
    });

    it('lanza NotFoundError si no se encuentra el instructor por userId', async () => {
      instructorRepository.findByUserId.mockResolvedValue(null);

      await expect(
        service.create(
          { name: 'Rutina', difficulty: 'BEGINNER' },
          { userId: 5, role: 'INSTRUCTOR' },
        ),
      ).rejects.toThrow(NotFoundError);
    });

    it('lanza NotFoundError si alguno de los ejercicios no existe en la base de datos', async () => {
      instructorRepository.findByUserId.mockResolvedValue(buildInstructor());
      exerciseRepository.findByIds.mockResolvedValue([{ id: 1 } as Exercise]);

      await expect(
        service.create(
          {
            name: 'Rutina',
            difficulty: 'BEGINNER',
            exercises: [{ exerciseId: 1 }, { exerciseId: 2 }],
          },
          { userId: 5, role: 'INSTRUCTOR' },
        ),
      ).rejects.toThrow(NotFoundError);
    });

    it('autoasigna el instructorId obtenido del repositorio y crea la rutina correctamente', async () => {
      const instructor = buildInstructor({ id: 42, userId: 5 });
      instructorRepository.findByUserId.mockResolvedValue(instructor);
      exerciseRepository.findByIds.mockResolvedValue([
        { id: 1 } as Exercise,
        { id: 2 } as Exercise,
      ]);

      const createdRoutine = buildRoutine({
        id: 100,
        name: 'Rutina Pecho',
        difficulty: 'BEGINNER',
        instructorId: 42,
      });
      routineRepository.create.mockResolvedValue(createdRoutine);

      const input = {
        name: 'Rutina Pecho',
        difficulty: 'BEGINNER' as const,
        exercises: [{ exerciseId: 1 }, { exerciseId: 2 }],
      };

      const result = await service.create(input, {
        userId: 5,
        role: 'INSTRUCTOR',
      });

      expect(instructorRepository.findByUserId).toHaveBeenCalledWith(5);
      expect(exerciseRepository.findByIds).toHaveBeenCalledWith([1, 2]);
      expect(routineRepository.create).toHaveBeenCalledWith({
        ...input,
        instructorId: 42,
      });
      expect(result.id).toBe(100);
      expect((result as any).instructorId).toBe(42);
    });
  });

  describe('update', () => {
    it('lanza NotFoundError si la rutina a modificar no existe', async () => {
      routineRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(
          10,
          { name: 'Nuevo' },
          { userId: 5, role: 'INSTRUCTOR' },
        ),
      ).rejects.toThrow(NotFoundError);
    });

    it('lanza ForbiddenError si el instructor no es el dueño de la rutina', async () => {
      routineRepository.findOne.mockResolvedValue(
        buildRoutine({ id: 10, instructorId: 99 }),
      );
      instructorRepository.findByUserId.mockResolvedValue(
        buildInstructor({ id: 10, userId: 5 }),
      );

      await expect(
        service.update(
          10,
          { name: 'Nuevo' },
          { userId: 5, role: 'INSTRUCTOR' },
        ),
      ).rejects.toThrow(ForbiddenError);
    });

    it('actualiza la rutina si el instructor es el propietario', async () => {
      const existing = buildRoutine({ id: 10, instructorId: 10 });
      routineRepository.findOne.mockResolvedValue(existing);
      instructorRepository.findByUserId.mockResolvedValue(
        buildInstructor({ id: 10, userId: 5 }),
      );
      routineRepository.update.mockResolvedValue({
        ...existing,
        name: 'Nombre Modificado',
      });

      const result = await service.update(
        10,
        { name: 'Nombre Modificado' },
        { userId: 5, role: 'INSTRUCTOR' },
      );

      expect(result.name).toBe('Nombre Modificado');
      expect(routineRepository.update).toHaveBeenCalledWith(10, {
        name: 'Nombre Modificado',
      });
    });
  });

  describe('remove', () => {
    it('lanza NotFoundError si la rutina no existe', async () => {
      routineRepository.findOne.mockResolvedValue(null);

      await expect(
        service.remove(10, { userId: 5, role: 'INSTRUCTOR' }),
      ).rejects.toThrow(NotFoundError);
    });

    it('lanza ForbiddenError si un instructor intenta borrar una rutina ajena', async () => {
      routineRepository.findOne.mockResolvedValue(
        buildRoutine({ id: 10, instructorId: 99 }),
      );
      instructorRepository.findByUserId.mockResolvedValue(
        buildInstructor({ id: 10, userId: 5 }),
      );

      await expect(
        service.remove(10, { userId: 5, role: 'INSTRUCTOR' }),
      ).rejects.toThrow(ForbiddenError);
    });

    it('ejecuta el soft delete en el repositorio si el instructor es el propietario', async () => {
      routineRepository.findOne.mockResolvedValue(
        buildRoutine({ id: 10, instructorId: 10 }),
      );
      instructorRepository.findByUserId.mockResolvedValue(
        buildInstructor({ id: 10, userId: 5 }),
      );
      routineRepository.remove.mockResolvedValue(undefined);

      await service.remove(10, { userId: 5, role: 'INSTRUCTOR' });

      expect(routineRepository.remove).toHaveBeenCalledWith(10);
    });
  });
});
