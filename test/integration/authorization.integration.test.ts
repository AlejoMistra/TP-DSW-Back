import 'dotenv/config';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import supertest from 'supertest';
import { prismaMock } from '../mocks/prisma.mock.js';
import { app } from '../../src/app.js';
import {
  generateTestToken,
  generateExpiredToken,
  authHeader,
} from '../helpers/auth.helper.js';

describe('Authorization & authentication middleware — mocked Prisma', () => {
  let server: http.Server;
  let request: ReturnType<typeof supertest>;
  let adminToken: string;
  let instructorToken: string;
  let memberToken: string;

  beforeAll(async () => {
    server = http.createServer(app);
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const { port } = server.address() as AddressInfo;
    request = supertest(`http://localhost:${port}`);

    adminToken = generateTestToken({ userId: 1, role: 'ADMIN' });
    instructorToken = generateTestToken({ userId: 2, role: 'INSTRUCTOR' });
    memberToken = generateTestToken({ userId: 3, role: 'MEMBER' });
  });

  afterAll(() => {
    server.close();
  });

  describe('public endpoints', () => {
    it('GET / is reachable without a token', async () => {
      const res = await request.get('/');
      expect(res.status).toBe(200);
    });

    it('GET /health is reachable without a token', async () => {
      const res = await request.get('/health');
      expect(res.status).toBe(200);
    });
  });

  describe('unauthenticated requests', () => {
    it('rejects GET /api/users with 401 UNAUTHORIZED', async () => {
      const res = await request.get('/api/users');
      expect(res.status).toBe(401);
      expect(res.body.code).toBe('UNAUTHORIZED');
    });

    it('rejects GET /api/classBookings with 401 UNAUTHORIZED', async () => {
      const res = await request.get('/api/classBookings');
      expect(res.status).toBe(401);
      expect(res.body.code).toBe('UNAUTHORIZED');
    });
  });

  describe('invalid tokens', () => {
    it('rejects a malformed/invalid token with 401 UNAUTHORIZED', async () => {
      const res = await request
        .get('/api/users')
        .set('Authorization', 'Bearer this.is.invalid');

      expect(res.status).toBe(401);
      expect(res.body.code).toBe('UNAUTHORIZED');
    });

    it('rejects an expired token with 401 UNAUTHORIZED', async () => {
      const expiredToken = generateExpiredToken({ userId: 1, role: 'ADMIN' });

      const res = await request.get('/api/users').set(authHeader(expiredToken));

      expect(res.status).toBe(401);
      expect(res.body.code).toBe('UNAUTHORIZED');
    });
  });

  describe('MEMBER role', () => {
    it('is forbidden from GET /api/users (ADMIN only)', async () => {
      const res = await request.get('/api/users').set(authHeader(memberToken));
      expect(res.status).toBe(403);
      expect(res.body.code).toBe('FORBIDDEN');
    });

    it('can GET /api/exercises', async () => {
      prismaMock.exercise.findMany.mockResolvedValue([]);

      const res = await request
        .get('/api/exercises')
        .set(authHeader(memberToken));

      expect(res.status).toBe(200);
    });

    it('is forbidden from creating exercises (ADMIN & INSTRUCTOR only)', async () => {
      const res = await request
        .post('/api/exercises')
        .set(authHeader(memberToken))
        .send({ name: 'Test Exercise', description: 'Testing' });

      expect(res.status).toBe(403);
      expect(res.body.code).toBe('FORBIDDEN');
    });

    it('is forbidden from accessing member by ID (ADMIN & INSTRUCTOR only)', async () => {
      const res = await request
        .get('/api/members/1')
        .set(authHeader(memberToken));
      expect(res.status).toBe(403);
      expect(res.body.code).toBe('FORBIDDEN');
    });

    it('is forbidden from accessing membership by ID (ADMIN only)', async () => {
      const res = await request
        .get('/api/memberships/1')
        .set(authHeader(memberToken));
      expect(res.status).toBe(403);
      expect(res.body.code).toBe('FORBIDDEN');
    });

    it('is forbidden from accessing payment by ID (ADMIN only)', async () => {
      const res = await request
        .get('/api/payments/1')
        .set(authHeader(memberToken));
      expect(res.status).toBe(403);
      expect(res.body.code).toBe('FORBIDDEN');
    });

    it('can GET /api/members/me', async () => {
      prismaMock.member.findFirst.mockResolvedValue({
        id: 3,
        userId: 3,
        name: 'Juan',
        surname: 'Perez',
        phone: '123456789',
        docType: 'DNI',
        docNumber: '12345678',
        birthDate: new Date('1990-01-01'),
        status: 'ACTIVE',
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 3,
          email: 'juan@example.com',
          role: 'MEMBER',
          password: 'hashedpassword',
          deletedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      } as any);

      const res = await request
        .get('/api/members/me')
        .set(authHeader(memberToken));
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Juan');
      expect(res.body.email).toBe('juan@example.com');
    });

    it('can GET /api/memberships/me', async () => {
      prismaMock.membership.findFirst.mockResolvedValue({
        id: 1,
        memberId: 3,
        membershipPlanId: 1,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        status: 'ACTIVE',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
        deletedAt: null,
      } as any);

      const res = await request
        .get('/api/memberships/me')
        .set(authHeader(memberToken));
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(1);
    });

    it('can GET /api/payments/me', async () => {
      prismaMock.payment.findMany.mockResolvedValue([]);

      const res = await request
        .get('/api/payments/me')
        .set(authHeader(memberToken));
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('INSTRUCTOR role', () => {
    it('is forbidden from GET /api/users (ADMIN only)', async () => {
      const res = await request
        .get('/api/users')
        .set(authHeader(instructorToken));
      expect(res.status).toBe(403);
      expect(res.body.code).toBe('FORBIDDEN');
    });

    it('is forbidden from creating a class schedule (ADMIN only)', async () => {
      const res = await request
        .post('/api/classSchedules')
        .set(authHeader(instructorToken))
        .send({});

      expect(res.status).toBe(403);
      expect(res.body.code).toBe('FORBIDDEN');
    });

    it('can GET /api/exercises', async () => {
      prismaMock.exercise.findMany.mockResolvedValue([]);

      const res = await request
        .get('/api/exercises')
        .set(authHeader(instructorToken));

      expect(res.status).toBe(200);
    });

    it('is forbidden from GET /api/instructors (ADMIN only)', async () => {
      const res = await request
        .get('/api/instructors')
        .set(authHeader(instructorToken));
      expect(res.status).toBe(403);
      expect(res.body.code).toBe('FORBIDDEN');
    });

    it('is forbidden from GET /api/classSessions/instructor/1 (ADMIN only)', async () => {
      const res = await request
        .get('/api/classSessions/instructor/1')
        .set(authHeader(instructorToken));
      expect(res.status).toBe(403);
      expect(res.body.code).toBe('FORBIDDEN');
    });

    it('can GET /api/instructors/me', async () => {
      prismaMock.instructor.findFirst.mockResolvedValue({
        id: 2,
        userId: 2,
        name: 'Gabriel',
        surname: 'Martinez',
        phone: '1122334455',
        docNumber: '25111222',
        docType: 'DNI',
        joinDate: new Date(),
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 2,
          email: 'gabrielmartinez@gmail.com',
          role: 'INSTRUCTOR',
          password: 'hashedpassword',
          deletedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      } as any);

      const res = await request
        .get('/api/instructors/me')
        .set(authHeader(instructorToken));
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Gabriel');
    });

    it('can GET /api/classSessions/me', async () => {
      prismaMock.instructor.findFirst.mockResolvedValue({
        id: 2,
        userId: 2,
      } as any);
      prismaMock.classSession.findMany.mockResolvedValue([]);

      const res = await request
        .get('/api/classSessions/me')
        .set(authHeader(instructorToken));
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('ADMIN role', () => {
    it('can GET /api/users', async () => {
      prismaMock.user.findMany.mockResolvedValue([]);

      const res = await request.get('/api/users').set(authHeader(adminToken));

      expect(res.status).toBe(200);
    });

    it('can GET /api/instructors', async () => {
      prismaMock.instructor.findMany.mockResolvedValue([]);
      prismaMock.instructor.count.mockResolvedValue(0);

      const res = await request
        .get('/api/instructors')
        .set(authHeader(adminToken));

      expect(res.status).toBe(200);
    });
  });
});
