import cors from 'cors';
import { ForbiddenError } from '../utils/errors.js';

export interface CorsEnvConfig {
  NODE_ENV?: string;
  FRONTEND_URL?: string;
  CORS_ORIGIN?: string;
}

export function parseAllowedOrigins(originsString?: string): string[] {
  if (!originsString) return [];
  return originsString
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter((origin) => origin.length > 0);
}

export function getCorsOptions(
  env: CorsEnvConfig = process.env
): cors.CorsOptions {
  const isProduction = env.NODE_ENV === 'production';

  if (isProduction) {
    const rawOrigins = env.FRONTEND_URL || env.CORS_ORIGIN;
    if (!rawOrigins || rawOrigins.trim() === '') {
      throw new Error(
        'FRONTEND_URL is required in production environment. Configure it in your deployment environment variables.'
      );
    }

    const allowedOrigins = parseAllowedOrigins(rawOrigins);

    return {
      origin: (origin, callback) => {
        // Permitir peticiones sin header Origin (ej. llamadas internas, Render health checks, curl, Postman)
        if (!origin) {
          return callback(null, true);
        }

        const normalizedOrigin = origin.replace(/\/$/, '');
        if (allowedOrigins.includes(normalizedOrigin)) {
          return callback(null, true);
        }

        return callback(
          new ForbiddenError(`Origin '${origin}' no permitido por la política CORS.`)
        );
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    };
  }

  // En entorno de desarrollo / no productivo, se permite cualquier origen sin restricción
  return {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
}

export const corsOptions = getCorsOptions();