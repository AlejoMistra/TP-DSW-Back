import { prisma } from '../../lib/prisma.js';
import type { User, Member, Instructor } from '../../generated/prisma/client.js';

export type UserWithIdentity = User & {
  member: Member | null;
  instructor: Instructor | null;
};

export class AuthRepository {
  async findByEmailWithRelations(email: string): Promise<UserWithIdentity | null> {
    return prisma.user.findUnique({
      where: { email },
      include: {
        member: true,
        instructor: true,
      },
    });
  }

  async activateUser(userId: number, passwordHash: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        accountStatus: 'ACTIVE',
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  async recordLoginSuccess(userId: number): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: {
        lastLoginAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  async recordFailedLogin(
    userId: number,
    failedAttempts: number,
    lockedUntil: Date | null,
  ): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: failedAttempts,
        lockedUntil,
      },
    });
  }
}

