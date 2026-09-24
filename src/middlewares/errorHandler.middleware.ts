import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../utils/errors.js';
import { Prisma } from '../generated/prisma/client.js';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof z.ZodError) {
    res.status(400).json({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Validacion fallida',
      details: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      code: err.code,
      message: err.message,
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({
        statusCode: 409,
        code: 'CONFLICT',
        message: 'Conflicto de unicidad',
      });
      return;
    }

    if (err.code === 'P2003') {
      res.status(409).json({
        statusCode: 409,
        code: 'CONFLICT',
        message: 'Referencia inválida (foreign key)',
      });
      return;
    }

    if (err.code === 'P2025') {
      res.status(404).json({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: 'Recurso no encontrado',
      });
      return;
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  res.status(500).json({
    statusCode: 500,
    code: 'INTERNAL_ERROR',
    message: 'Error interno del servidor',
  });
}

