import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../utils/errors.js';
import { Prisma } from '../generated/prisma/client.js';

export interface ApiErrorResponse {
  statusCode: number;
  code: string;
  message: string;
  details: Array<{ field?: string; message: string }> | null;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // 1. Errores de Validación (Zod)
  if (err instanceof z.ZodError) {
    const errorResponse: ApiErrorResponse = {
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Validación fallida en los datos enviados',
      details: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    };
    res.status(400).json(errorResponse);
    return;
  }

  // 2. Errores operacionales controlados (AppError y derivados)
  if (err instanceof AppError) {
    const errorResponse: ApiErrorResponse = {
      statusCode: err.statusCode,
      code: err.code,
      message: err.message,
      details: null,
    };
    res.status(err.statusCode).json(errorResponse);
    return;
  }

  // 3. Errores conocidos de Prisma (Base de datos)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation (P2002)
    if (err.code === 'P2002') {
      const targetRaw = err.meta?.target;
      const target = Array.isArray(targetRaw) ? targetRaw.map(String) : [];
      const targetText = String(targetRaw ?? '').toLowerCase();

      let message = 'Ya existe un registro con esos datos únicos';

      if (
        (target.includes('memberId') && target.includes('classSessionId')) ||
        (targetText.includes('memberid') &&
          targetText.includes('classsessionid')) ||
        targetText.includes('class_bookings_memberid_classsessionid')
      ) {
        message = 'El socio ya está reservado en esta sesión de clase';
      } else if (
        (target.includes('classScheduleId') &&
          target.includes('date') &&
          target.includes('startTime')) ||
        (targetText.includes('classscheduleid') &&
          targetText.includes('date') &&
          targetText.includes('starttime'))
      ) {
        message = 'Ya existe una sesión de clase para ese horario y fecha';
      }

      const errorResponse: ApiErrorResponse = {
        statusCode: 409,
        code: 'CONFLICT',
        message,
        details: null,
      };
      res.status(409).json(errorResponse);
      return;
    }

    // Foreign key constraint failed (P2003)
    if (err.code === 'P2003') {
      const errorResponse: ApiErrorResponse = {
        statusCode: 409,
        code: 'CONFLICT',
        message: 'Referencia a entidad inexistente (clave foránea inválida)',
        details: null,
      };
      res.status(409).json(errorResponse);
      return;
    }

    // Registro no encontrado en update/delete (P2025)
    if (err.code === 'P2025') {
      const errorResponse: ApiErrorResponse = {
        statusCode: 404,
        code: 'NOT_FOUND',
        message: 'El recurso solicitado no fue encontrado',
        details: null,
      };
      res.status(404).json(errorResponse);
      return;
    }
  }

  // 4. Errores no controlados (500)
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  const errorResponse: ApiErrorResponse = {
    statusCode: 500,
    code: 'INTERNAL_ERROR',
    message: 'Error interno del servidor',
    details: null,
  };
  res.status(500).json(errorResponse);
}
