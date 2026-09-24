import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../src/shared/constants.js';
import type { UserRole } from '../../src/generated/prisma/enums.js';

export function generateTestToken(
  payload: { userId: number; role: UserRole },
  options: jwt.SignOptions = { expiresIn: '1h' },
): string {
  return jwt.sign(payload, JWT_SECRET, options);
}

export function generateExpiredToken(payload: { userId: number; role: UserRole }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '-1s' });
}

export function authHeader(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}
