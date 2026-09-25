import { vi, beforeEach } from 'vitest';
import { mockDeep, mockReset, type DeepMockProxy } from 'vitest-mock-extended';
import type { PrismaClient } from '../../src/generated/prisma/client.js';

vi.mock('../../src/lib/prisma.js', () => ({
  prisma: mockDeep<PrismaClient>(),
}));

// import after vi.mock so the module registry hands back the mocked instance
const { prisma } = await import('../../src/lib/prisma.js');

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});
