import bcrypt from 'bcrypt';
import {
  BCRYPT_SALT_ROUNDS,
  DEFAULT_MEMBER_PASSWORD,
  DEFAULT_INSTRUCTOR_PASSWORD,
} from '../shared/constants.js';

export async function hashDefaultPassword(
  role: 'MEMBER' | 'INSTRUCTOR',
): Promise<string> {
  const plainPassword =
    role === 'MEMBER' ? DEFAULT_MEMBER_PASSWORD : DEFAULT_INSTRUCTOR_PASSWORD;

  return bcrypt.hash(plainPassword, BCRYPT_SALT_ROUNDS);
}
