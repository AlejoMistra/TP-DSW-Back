import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../utils/errors.js';
import { UserRole } from '../generated/prisma/enums.js';

/**
 * @description Middleware de autorización que verifica que el usuario tenga el rol permitido
 * @param allowedRoles - Roles permitidos para acceder al recurso
 * @returns Middleware de autorización
 */
export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Usuario no autenticado'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('No tienes permisos suficientes para realizar esta acción'));
    }

    next();
  };
}
