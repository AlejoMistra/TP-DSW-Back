import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRepository } from './auth.repository.js';
import { ActivateAccountInput, LoginInput } from './auth.schemas.js';
import {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
} from '../../utils/errors.js';
import {
  BCRYPT_SALT_ROUNDS,
  JWT_EXPIRES_IN,
  JWT_SECRET,
  DEFAULT_INSTRUCTOR_PASSWORD,
  DEFAULT_MEMBER_PASSWORD,
  LOCKOUT_DURATION_MINUTES,
  MAX_FAILED_LOGIN_ATTEMPTS,
} from '../../shared/constants.js';

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
    accountStatus: string;
    memberId: number | null;
    instructorId: number | null;
  };
}

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async activateAccount(
    userId: number,
    input: ActivateAccountInput,
  ): Promise<{ message: string }> {
    if (
      input.newPassword === DEFAULT_MEMBER_PASSWORD ||
      input.newPassword === DEFAULT_INSTRUCTOR_PASSWORD
    ) {
      throw new BadRequestError(
        'La nueva contraseña debe ser diferente a la contraseña temporal por defecto',
      );
    }

    const passwordHash = await bcrypt.hash(
      input.newPassword,
      BCRYPT_SALT_ROUNDS,
    );

    try {
      await this.authRepository.activateUser(userId, passwordHash);
      await this.authRepository.recordLoginSuccess(userId);
    } catch {
      throw new BadRequestError(
        'No se pudo activar la cuenta o la cuenta ya se encuentra activa',
      );
    }

    return {
      message: 'Cuenta activada exitosamente. Ya puedes acceder al sistema.',
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.authRepository.findByEmailWithRelations(
      input.email,
    );

    // 1. Validar existencia
    if (!user) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // 2. Validar deshabilitado
    if (!user.isActive || user.deletedAt !== null) {
      throw new ForbiddenError(
        'Cuenta deshabilitada, contacta a la administración',
      );
    }

    // 3. Validar lockout
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new ForbiddenError(
        'Cuenta bloqueada temporalmente por intentos fallidos. Intenta más tarde.',
      );
    }

    // 4. Comparar contraseña (incluso la provisoria)
    if (!user.passwordHash) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const isValidPassword = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );

    if (!isValidPassword) {
      const nextAttempts = user.failedLoginAttempts + 1;
      const lockedUntil =
        nextAttempts >= MAX_FAILED_LOGIN_ATTEMPTS
          ? new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000)
          : null;

      await this.authRepository.recordFailedLogin(
        user.id,
        nextAttempts,
        lockedUntil,
      );

      throw new UnauthorizedError('Credenciales inválidas');
    }

    // 5. Login exitoso: emitir JWT y devolver accountStatus
    await this.authRepository.recordLoginSuccess(user.id);

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      },
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
        memberId: user.member?.id ?? null,
        instructorId: user.instructor?.id ?? null,
      },
    };
  }
}
