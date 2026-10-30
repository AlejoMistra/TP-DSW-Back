import { describe, it, expect } from 'vitest';
import {
  parseAllowedOrigins,
  getCorsOptions,
} from './cors.config.js';
import { ForbiddenError } from '../utils/errors.js';

describe('CORS Configuration', () => {
  describe('parseAllowedOrigins', () => {
    it('returns empty array when input is undefined or empty', () => {
      expect(parseAllowedOrigins(undefined)).toEqual([]);
      expect(parseAllowedOrigins('')).toEqual([]);
      expect(parseAllowedOrigins('   ')).toEqual([]);
    });

    it('parses single origin and removes trailing slashes', () => {
      expect(parseAllowedOrigins('https://frontend.com/')).toEqual([
        'https://frontend.com',
      ]);
    });

    it('parses multiple comma-separated origins, trims spaces and trailing slashes', () => {
      const input =
        ' https://app.example.com/ , http://localhost:5173/ , https://admin.example.com ';
      expect(parseAllowedOrigins(input)).toEqual([
        'https://app.example.com',
        'http://localhost:5173',
        'https://admin.example.com',
      ]);
    });
  });

  describe('getCorsOptions in development', () => {
    it('configures origin: "*" and no credentials in development', () => {
      const options = getCorsOptions({ NODE_ENV: 'development' });

      expect(options.origin).toBe('*');
      expect(options.credentials).toBeUndefined();
      expect(options.methods).toEqual([
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'OPTIONS',
      ]);
      expect(options.allowedHeaders).toEqual(['Content-Type', 'Authorization']);
    });
  });

  describe('getCorsOptions in production', () => {
    it('throws an error if FRONTEND_URL is not provided (fail-fast)', () => {
      expect(() =>
        getCorsOptions({ NODE_ENV: 'production', FRONTEND_URL: '' })
      ).toThrowError(/FRONTEND_URL is required in production environment/);

      expect(() =>
        getCorsOptions({ NODE_ENV: 'production' })
      ).toThrowError(/FRONTEND_URL is required in production environment/);
    });

    it('validates allowed origins and rejects unauthorized origins', () => {
      const options = getCorsOptions({
        NODE_ENV: 'production',
        FRONTEND_URL: 'https://gym.vercel.app, https://admin.gym.vercel.app/',
      });

      expect(typeof options.origin).toBe('function');
      expect(options.credentials).toBeUndefined();

      const originValidator = options.origin as (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
      ) => void;

      // Requests without origin (internal / health check / curl) should be allowed
      let allowedResult: boolean | undefined;
      let errorResult: Error | null = null;

      originValidator(undefined, (err, allow) => {
        errorResult = err;
        allowedResult = allow;
      });
      expect(errorResult).toBeNull();
      expect(allowedResult).toBe(true);

      // Allowed origin (exact match)
      originValidator('https://gym.vercel.app', (err, allow) => {
        errorResult = err;
        allowedResult = allow;
      });
      expect(errorResult).toBeNull();
      expect(allowedResult).toBe(true);

      // Allowed origin with trailing slash in request
      originValidator('https://admin.gym.vercel.app/', (err, allow) => {
        errorResult = err;
        allowedResult = allow;
      });
      expect(errorResult).toBeNull();
      expect(allowedResult).toBe(true);

      // Disallowed origin should return ForbiddenError
      originValidator('https://malicious-site.com', (err, allow) => {
        errorResult = err;
        allowedResult = allow;
      });
      expect(errorResult).toBeInstanceOf(ForbiddenError);
      expect((errorResult as unknown as ForbiddenError).message).toContain(
        'no permitido por la política CORS'
      );
    });
  });
});