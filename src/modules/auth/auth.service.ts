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
  LOCKOUT_DURATION_MINUTES,
  MAX_FAILED_LOGIN_ATTEMPTS,
} from '../../shared/constants.js';

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async activateAccount(
    input: ActivateAccountInput,
  ): Promise<{ message: string }> {
    const user = await this.authRepository.findByEmailWithRelations(input.email);

    if (!user) {
      throw new BadRequestError("No se pudieron verificar los datos");
    }

    if (user.accountStatus === 'ACTIVE') {
      throw new BadRequestError('La cuenta ya está activada, por favor inicia sesión');
    }

    if (user.accountStatus !== 'PENDING_ACTIVATION') {
      throw new BadRequestError("No se pudieron verificar los datos");
    }

    const identityEntity = user.member ?? user.instructor;
    if (!identityEntity) {
      throw new BadRequestError("No se pudieron verificar los datos");
    }

    const normalize = (str: string) => str.trim().toLowerCase();
    const nameMatches = normalize(identityEntity.name) === normalize(input.name);
    const surnameMatches =
      normalize(identityEntity.surname) === normalize(input.surname);
    const docMatches = identityEntity.docNumber.trim() === input.docNumber.trim();

    if (!nameMatches || !surnameMatches || !docMatches) {
      throw new BadRequestError("No se pudieron verificar los datos");
    }

    const passwordHash = await bcrypt.hash(
      input.newPassword,
      BCRYPT_SALT_ROUNDS,
    );

    await this.authRepository.activateUser(user.id, passwordHash);

    return {
      message: 'Cuenta activada exitosamente. Ya puedes iniciar sesión.',
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.authRepository.findByEmailWithRelations(input.email);

    // 1. Find User by email -> if not found, generic error
    if (!user) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // 2. If accountStatus === PENDING_ACTIVATION -> specific activation error
    if (user.accountStatus === 'PENDING_ACTIVATION') {
      throw new ForbiddenError(
        'Debes activar tu cuenta antes de iniciar sesión',
      );
    }

    // 3. If isActive === false -> account disabled
    if (!user.isActive) {
      throw new ForbiddenError(
        'Cuenta deshabilitada, contacta a la administración',
      );
    }

    // Check account lockout
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new ForbiddenError(
        'Cuenta bloqueada temporalmente por intentos fallidos. Intenta más tarde.',
      );
    }

    // 4. Compare password
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

    // 5. On success: issue JWT, update lastLoginAt, reset failedLoginAttempts
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
      },
    };
  }
}

