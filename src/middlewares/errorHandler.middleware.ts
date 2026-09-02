import { Request, Response, NextFunction} from 'express';
import { z } from 'zod';
import { AppError } from '../utils/errors.js';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof z.ZodError) {
    res.status(400).json({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      error: 'Validacion fallida',
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
      error: err.message,
    });
    return;
  }
  
  //para errores no manejados: si no estamos en development, loguea server-side y responde con 500, no expone detalles al cliente
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  } else{
    res.status(500).json({
        statusCode: 500,
        code: 'INTERNAL_ERROR',
        error: 'Error interno del servidor',
      });
  }
}
