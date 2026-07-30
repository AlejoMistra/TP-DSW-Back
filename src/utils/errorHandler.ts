import { Response } from 'express';
import { z } from 'zod';

export function handleError(error: unknown, res: Response): void {
  if (error instanceof z.ZodError) {
    const details = error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    res
      .status(400)
      .json({
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        error: 'Validacion fallida',
        details,
      });
    return;
  }

  const statusCode = getHttpStatus(error);
  const code = getErrorCode(error);
  const message = getErrorMessage(error);

  res.status(statusCode).json({ statusCode, code, error: message });
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Error desconocido.';
}

export function getHttpStatus(error: unknown): number {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('not found') || message.includes('no encontrado')) {
      return 404;
    }

    if (message.includes('already exists') || message.includes('ya existe')) {
      return 409;
    }

    if (message.includes('unauthorized') || message.includes('no autorizado')) {
      return 401;
    }
  }
  return 500;
}

export function getErrorCode(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('no encontrado')) {
      return 'NOT_FOUND';
    }

    if (message.includes('ya existe')) {
      return 'CONFLICT';
    }

    if (message.includes('no autorizado')) {
      return 'UNAUTHORIZED';
    }
  }
  return 'INTERNAL_ERROR';
}
