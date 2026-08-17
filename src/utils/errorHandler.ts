import { Response } from 'express';
import { z } from 'zod';
import { Prisma } from '../generated/prisma/client.js';

export function handleError(error: unknown, res: Response): void {
  // 1) Errores de validación (Zod)
  if (error instanceof z.ZodError) {
    const details = error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    res.status(400).json({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      error: 'Validacion fallida',
      details,
    });
    return;
  }

  // 2) Errores conocidos de Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint
    if (error.code === 'P2002') {
      const targetRaw = error.meta?.target;
      const target = Array.isArray(targetRaw) ? targetRaw.map(String) : [];
      const targetText = String(targetRaw ?? '').toLowerCase();

      // Caso: class_booking duplicado @@unique([memberId, classSessionId])
      if (
        (target.includes('memberId') && target.includes('classSessionId')) ||
        (targetText.includes('memberid') && targetText.includes('classsessionid')) ||
        targetText.includes('class_bookings_memberid_classsessionid')
      ) {
        res.status(409).json({
          statusCode: 409,
          code: 'CONFLICT',
          error: 'El member ya está reservado en esta classSession',
        });
        return;
      }

      // Caso: class_session duplicada (classScheduleId, date, startTime)
      if (
        (target.includes('classScheduleId') &&
          target.includes('date') &&
          target.includes('startTime')) ||
        (targetText.includes('classscheduleid') &&
          targetText.includes('date') &&
          targetText.includes('starttime'))
      ) {
        res.status(409).json({
          statusCode: 409,
          code: 'CONFLICT',
          error: 'Ya existe una classSession con ese classScheduleId, date y startTime',
        });
        return;
      }

      // Fallback P2002
      res.status(409).json({
        statusCode: 409,
        code: 'CONFLICT',
        error: 'Conflicto de unicidad',
      });
      return;
    }

    // Foreign key constraint failed
    if (error.code === 'P2003') {
      res.status(409).json({
        statusCode: 409,
        code: 'CONFLICT',
        error: 'Referencia inválida (foreign key)',
      });
      return;
    }

    // Registro no encontrado en update/delete con where único
    if (error.code === 'P2025') {
      res.status(404).json({
        statusCode: 404,
        code: 'NOT_FOUND',
        error: 'Recurso no encontrado',
      });
      return;
    }
  }

  // 3) Fallback genérico
  const statusCode = getHttpStatus(error);
  const code = getErrorCode(error);
  const message = getErrorMessage(error);

  res.status(statusCode).json({
    statusCode,
    code,
    error: message,
  });
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Error desconocido.';
}

export function getHttpStatus(error: unknown): number {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (
      message.includes('validacion') ||
      message.includes('inválido') ||
      message.includes('invalido')
    ) return 400;

    if (message.includes('not found') || message.includes('no encontrado')) return 404;

    if (message.includes('already exists') || message.includes('ya existe')) return 409;

    if (message.includes('unauthorized') || message.includes('no autorizado')) return 401;
  }

  return 500;
}

export function getErrorCode(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (
      message.includes('validacion') ||
      message.includes('inválido') ||
      message.includes('invalido')
    ) return 'VALIDATION_ERROR';

    if (message.includes('not found') || message.includes('no encontrado')) return 'NOT_FOUND';

    if (message.includes('already exists') || message.includes('ya existe')) return 'CONFLICT';

    if (message.includes('unauthorized') || message.includes('no autorizado')) return 'UNAUTHORIZED';
  }

  return 'INTERNAL_ERROR';
}