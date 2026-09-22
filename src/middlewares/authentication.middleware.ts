import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errors.js';
import { JWT_SECRET } from '../shared/constants.js';
import { UserRole } from '../generated/prisma/enums.js';

export interface AuthUser {
  userId: number;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/**
 * Middleware de autenticación que verifica que el usuario esté autenticado
  */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Token no proporcionado'));
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    return next(new UnauthorizedError('Token no proporcionado'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId?: number;
      role?: UserRole;
    };

    if (!decoded.userId || !decoded.role) {
      return next(new UnauthorizedError('Token inválido o malformado'));
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (_error) {
    return next(new UnauthorizedError('Token inválido o expirado'));
  }
}
