import { Response } from 'express';
import { z } from 'zod';

export function handleError(error: unknown, res: Response): void {
  if (error instanceof z.ZodError) {
    res
      .status(400)
      .json({ error: 'Validacion fallida', details: error.issues });
    return;
  }
  const status = getHttpStatus(error);
  const message = getErrorMessage(error);

  res.status(status).json({ error: message });
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
