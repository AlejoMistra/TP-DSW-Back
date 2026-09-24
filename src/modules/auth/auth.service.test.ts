import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthService } from './auth.service.js';
import type { AuthRepository, UserWithIdentity } from './auth.repository.js';
import { BadRequestError, ForbiddenError, UnauthorizedError } from '../../utils/errors.js';

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
  },
}));

function buildUser(overrides: Partial<UserWithIdentity> = {}): UserWithIdentity {
  return {
    id: 1,
    email: 'member@example.com',
    passwordHash: 'hashed-password',
    accountStatus: 'ACTIVE',
    role: 'MEMBER',
    isActive: true,
    failedLoginAttempts: 0,
    lockedUntil: null,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    member: null,
    instructor: null,
    ...overrides,
  } as UserWithIdentity;
}

describe('AuthService', () => {
  let authRepository: {
    [K in keyof AuthRepository]: ReturnType<typeof vi.fn>;
  };
  let authService: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    authRepository = {
      findByEmailWithRelations: vi.fn(),
      activateUser: vi.fn(),
      recordLoginSuccess: vi.fn(),
      recordFailedLogin: vi.fn(),
    };
    authService = new AuthService(authRepository as unknown as AuthRepository);
  });

  describe('login', () => {
    it('throws UnauthorizedError when user does not exist', async () => {
      authRepository.findByEmailWithRelations.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'nobody@example.com', password: 'x' }),
      ).rejects.toThrow(UnauthorizedError);
    });

    it('throws ForbiddenError when account is pending activation', async () => {
      authRepository.findByEmailWithRelations.mockResolvedValue(
        buildUser({ accountStatus: 'PENDING_ACTIVATION' }),
      );

      await expect(
        authService.login({ email: 'member@example.com', password: 'x' }),
      ).rejects.toThrow(ForbiddenError);
    });

    it('throws ForbiddenError when account is disabled', async () => {
      authRepository.findByEmailWithRelations.mockResolvedValue(
        buildUser({ isActive: false }),
      );

      await expect(
        authService.login({ email: 'member@example.com', password: 'x' }),
      ).rejects.toThrow(ForbiddenError);
    });

    it('throws ForbiddenError when account is locked', async () => {
      authRepository.findByEmailWithRelations.mockResolvedValue(
        buildUser({ lockedUntil: new Date(Date.now() + 60_000) }),
      );

      await expect(
        authService.login({ email: 'member@example.com', password: 'x' }),
      ).rejects.toThrow(ForbiddenError);
    });

    it('throws UnauthorizedError and records failed attempt on wrong password', async () => {
      authRepository.findByEmailWithRelations.mockResolvedValue(
        buildUser({ failedLoginAttempts: 2 }),
      );
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(
        authService.login({ email: 'member@example.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedError);

      expect(authRepository.recordFailedLogin).toHaveBeenCalledWith(1, 3, null);
    });

    it('locks the account once max failed attempts is reached', async () => {
      authRepository.findByEmailWithRelations.mockResolvedValue(
        buildUser({ failedLoginAttempts: 4 }),
      );
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(
        authService.login({ email: 'member@example.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedError);

      const [, , lockedUntil] = authRepository.recordFailedLogin.mock.calls[0];
      expect(lockedUntil).toBeInstanceOf(Date);
    });

    it('returns a token and user on successful login', async () => {
      authRepository.findByEmailWithRelations.mockResolvedValue(buildUser());
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      vi.mocked(jwt.sign).mockReturnValue('signed-token' as never);

      const result = await authService.login({
        email: 'member@example.com',
        password: 'correct',
      });

      expect(authRepository.recordLoginSuccess).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        token: 'signed-token',
        user: { id: 1, email: 'member@example.com', role: 'MEMBER' },
      });
    });
  });

  describe('activateAccount', () => {
    const activationInput = {
      email: 'member@example.com',
      name: 'Carlos',
      surname: 'Test',
      docNumber: '99887766',
      newPassword: 'SecurePassword123!',
    };

    it('throws BadRequestError when user does not exist', async () => {
      authRepository.findByEmailWithRelations.mockResolvedValue(null);

      await expect(authService.activateAccount(activationInput)).rejects.toThrow(
        BadRequestError,
      );
    });

    it('throws BadRequestError when account is already active', async () => {
      authRepository.findByEmailWithRelations.mockResolvedValue(
        buildUser({ accountStatus: 'ACTIVE' }),
      );

      await expect(authService.activateAccount(activationInput)).rejects.toThrow(
        'La cuenta ya está activada, por favor inicia sesión',
      );
    });

    it('throws generic BadRequestError when identity data does not match', async () => {
      authRepository.findByEmailWithRelations.mockResolvedValue(
        buildUser({
          accountStatus: 'PENDING_ACTIVATION',
          member: { name: 'Otro', surname: 'Nombre', docNumber: '99887766' } as never,
        }),
      );

      await expect(authService.activateAccount(activationInput)).rejects.toThrow(
        'No se pudieron verificar los datos',
      );
    });

    it('activates the account when identity data matches (case-insensitive)', async () => {
      authRepository.findByEmailWithRelations.mockResolvedValue(
        buildUser({
          accountStatus: 'PENDING_ACTIVATION',
          member: { name: 'carlos', surname: 'test', docNumber: '99887766' } as never,
        }),
      );
      vi.mocked(bcrypt.hash).mockResolvedValue('new-hash' as never);

      const result = await authService.activateAccount(activationInput);

      expect(bcrypt.hash).toHaveBeenCalledWith(activationInput.newPassword, expect.any(Number));
      expect(authRepository.activateUser).toHaveBeenCalledWith(1, 'new-hash');
      expect(result.message).toMatch(/activada/);
    });
  });
});
