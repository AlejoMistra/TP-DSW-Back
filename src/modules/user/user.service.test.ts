import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from './user.service.js';
import type { UserRepository } from './user.repository.js';
import type { User } from '../../generated/prisma/client.js';
import { ConflictError, NotFoundError } from '../../utils/errors.js';

function buildUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    email: 'user@example.com',
    passwordHash: null,
    accountStatus: 'PENDING_ACTIVATION',
    role: 'MEMBER',
    isActive: true,
    failedLoginAttempts: 0,
    lockedUntil: null,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides,
  } as User;
}

describe('UserService', () => {
  let userRepository: {
    [K in keyof UserRepository]: ReturnType<typeof vi.fn>;
  };
  let userService: UserService;

  beforeEach(() => {
    userRepository = {
      getAll: vi.fn(),
      getOne: vi.fn(),
      findByEmail: vi.fn(),
      add: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    userService = new UserService(userRepository as unknown as UserRepository);
  });

  describe('getAll', () => {
    it('returns all users mapped to the response shape (no passwordHash)', async () => {
      userRepository.getAll.mockResolvedValue([buildUser(), buildUser({ id: 2 })]);

      const result = await userService.getAll();

      expect(result).toHaveLength(2);
      expect(result[0]).not.toHaveProperty('passwordHash');
    });
  });

  describe('getById', () => {
    it('throws NotFoundError when the user does not exist', async () => {
      userRepository.getOne.mockResolvedValue(null);

      await expect(userService.getById(99)).rejects.toThrow(NotFoundError);
    });

    it('returns the user when found', async () => {
      userRepository.getOne.mockResolvedValue(buildUser());

      const result = await userService.getById(1);

      expect(result?.email).toBe('user@example.com');
    });
  });

  describe('create', () => {
    it('throws ConflictError when the email is already in use', async () => {
      userRepository.findByEmail.mockResolvedValue(buildUser());

      await expect(
        userService.create({ email: 'user@example.com', role: 'MEMBER' }),
      ).rejects.toThrow(ConflictError);
      expect(userRepository.add).not.toHaveBeenCalled();
    });

    it('creates the user when the email is free', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.add.mockResolvedValue(buildUser());

      const result = await userService.create({ email: 'user@example.com', role: 'MEMBER' });

      expect(userRepository.add).toHaveBeenCalledWith({ email: 'user@example.com', role: 'MEMBER' });
      expect(result.email).toBe('user@example.com');
    });
  });

  describe('update', () => {
    it('throws NotFoundError when the user does not exist', async () => {
      userRepository.getOne.mockResolvedValue(null);

      await expect(userService.update(1, {})).rejects.toThrow(NotFoundError);
    });

    it('throws ConflictError when changing to an email already taken', async () => {
      userRepository.getOne.mockResolvedValue(buildUser());
      userRepository.findByEmail.mockResolvedValue(buildUser({ id: 2, email: 'taken@example.com' }));

      await expect(
        userService.update(1, { email: 'taken@example.com' }),
      ).rejects.toThrow(ConflictError);
    });

    it('updates the user when the new email is free', async () => {
      userRepository.getOne.mockResolvedValue(buildUser());
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.update.mockResolvedValue(buildUser({ email: 'new@example.com' }));

      const result = await userService.update(1, { email: 'new@example.com' });

      expect(result.email).toBe('new@example.com');
    });
  });

  describe('delete', () => {
    it('throws NotFoundError when the user does not exist', async () => {
      userRepository.getOne.mockResolvedValue(null);

      await expect(userService.delete(1)).rejects.toThrow(NotFoundError);
      expect(userRepository.delete).not.toHaveBeenCalled();
    });

    it('deletes the user when it exists', async () => {
      userRepository.getOne.mockResolvedValue(buildUser());

      await userService.delete(1);

      expect(userRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
