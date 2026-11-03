import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InstructorService } from './instructor.service.js';
import type { InstructorRepository } from './instructor.repository.js';
import type { UserRepository } from '../user/user.repository.js';
import { ConflictError, NotFoundError } from '../../utils/errors.js';
import { prisma } from '../../lib/prisma.js';

vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    $transaction: vi.fn(),
  },
}));

describe('InstructorService', () => {
  let repository: any;
  let userRepository: any;
  let service: InstructorService;

  beforeEach(() => {
    repository = {
      getAll: vi.fn(),
      count: vi.fn(),
      getById: vi.fn(),
      getByIdWithDeleted: vi.fn(),
      findByUserId: vi.fn(),
      getByUserIdWithDeleted: vi.fn(),
      findByDoc: vi.fn(),
      findByDocWithDeleted: vi.fn(),
      findByEmail: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    userRepository = {
      getAll: vi.fn(),
      count: vi.fn(),
      getOne: vi.fn(),
      findByEmail: vi.fn(),
      add: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    service = new InstructorService(
      repository as unknown as InstructorRepository,
      userRepository as unknown as UserRepository,
    );
  });

  describe('create', () => {
    it('throws ConflictError if an active instructor with the same document exists', async () => {
      repository.findByDocWithDeleted.mockResolvedValue({
        id: 1,
        name: 'Ana',
        surname: 'Gomez',
        docType: 'DNI',
        docNumber: '87654321',
        deletedAt: null,
      });

      await expect(
        service.create({
          name: 'Ana',
          surname: 'Gomez',
          phone: '11223344',
          docType: 'DNI',
          docNumber: '87654321',
          email: 'ana@example.com',
        }),
      ).rejects.toThrow('Ya existe un profesor activo con ese documento');
    });

    it('throws ConflictError with INACTIVE_INSTRUCTOR_EXISTS if instructor was soft-deleted', async () => {
      repository.findByDocWithDeleted.mockResolvedValue({
        id: 2,
        name: 'Carlos',
        surname: 'Lopez',
        docType: 'DNI',
        docNumber: '87654321',
        deletedAt: new Date(),
      });

      try {
        await service.create({
          name: 'Carlos',
          surname: 'Lopez',
          phone: '11223344',
          docType: 'DNI',
          docNumber: '87654321',
          email: 'carlos@example.com',
        });
        expect.unreachable('Debería haber lanzado ConflictError');
      } catch (err: any) {
        expect(err).toBeInstanceOf(ConflictError);
        expect(err.code).toBe('INACTIVE_INSTRUCTOR_EXISTS');
        expect(err.details).toEqual({
          instructorId: 2,
          name: 'Carlos',
          surname: 'Lopez',
          docType: 'DNI',
          docNumber: '87654321',
        });
      }
    });

    it('throws ConflictError if email is already in use by another user (active or deleted)', async () => {
      repository.findByDocWithDeleted.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue({
        id: 99,
        email: 'used@example.com',
        deletedAt: new Date(),
      });

      await expect(
        service.create({
          name: 'Carlos',
          surname: 'Lopez',
          phone: '11223344',
          docType: 'DNI',
          docNumber: '87654321',
          email: 'used@example.com',
        }),
      ).rejects.toThrow('Email ya registrado');
    });

    it('creates instructor atomically when data is valid', async () => {
      repository.findByDocWithDeleted.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue(null);

      const createdInstructor = {
        id: 10,
        userId: 20,
        name: 'Laura',
        surname: 'Perez',
        phone: '11223344',
        docType: 'DNI',
        docNumber: '87654321',
        joinDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { email: 'laura@example.com' },
      };

      (prisma.$transaction as any).mockImplementation(async (callback: any) => {
        return callback({
          user: userRepository,
          instructor: repository,
        });
      });

      userRepository.add.mockResolvedValue({ id: 20 });
      repository.create.mockResolvedValue(createdInstructor);

      const result = await service.create({
        name: 'Laura',
        surname: 'Perez',
        phone: '11223344',
        docType: 'DNI',
        docNumber: '87654321',
        email: 'laura@example.com',
      });

      expect(userRepository.add).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'laura@example.com',
          accountStatus: 'PENDING_ACTIVATION',
          role: 'INSTRUCTOR',
        }),
        expect.anything(),
      );
      expect(result.id).toBe(10);
      expect(result.email).toBe('laura@example.com');
    });
  });

  describe('reactivate', () => {
    it('throws NotFoundError if instructor does not exist', async () => {
      repository.getByIdWithDeleted.mockResolvedValue(null);

      await expect(
        service.reactivate(999, {
          name: 'X',
          surname: 'Y',
          docType: 'DNI',
          docNumber: '12345678',
          email: 'x@example.com',
        }),
      ).rejects.toThrow(NotFoundError);
    });

    it('reactivates a soft-deleted instructor and preserves original document', async () => {
      const existingInstructor = {
        id: 5,
        userId: 15,
        name: 'Pedro',
        surname: 'Rios',
        phone: '11223344',
        docType: 'DNI',
        docNumber: '11223344',
        deletedAt: new Date(),
        joinDate: new Date(),
        user: { email: 'pedro@example.com' },
      };

      repository.getByIdWithDeleted.mockResolvedValue(existingInstructor);

      (prisma.$transaction as any).mockImplementation(async (callback: any) => {
        return callback({
          user: userRepository,
          instructor: repository,
        });
      });

      repository.update.mockResolvedValue({
        ...existingInstructor,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { email: 'pedro@example.com' },
      });

      const result = await service.reactivate(5, {
        name: 'Pedro',
        surname: 'Rios',
        phone: '99887766',
        docType: 'PASAPORTE', // Intenta cambiar documento
        docNumber: '99999999', // Intenta cambiar documento
        email: 'pedro@example.com',
      });

      // Debe preservar DNI original
      expect(repository.update).toHaveBeenCalledWith(
        5,
        expect.objectContaining({
          docType: 'DNI',
          docNumber: '11223344',
          deletedAt: null,
        }),
        expect.anything(),
      );

      // Debe resetear credenciales a PENDING_ACTIVATION
      expect(userRepository.update).toHaveBeenCalledWith(
        15,
        expect.objectContaining({
          accountStatus: 'PENDING_ACTIVATION',
          passwordHash: expect.any(String),
          deletedAt: null,
          isActive: true,
        }),
        expect.anything(),
      );

      expect(result.id).toBe(5);
    });
  });
});
