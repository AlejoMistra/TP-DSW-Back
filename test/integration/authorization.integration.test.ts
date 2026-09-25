import 'dotenv/config';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import supertest from 'supertest';
import { prismaMock } from '../mocks/prisma.mock.js';
import { app } from '../../src/app.js';
import { generateTestToken, generateExpiredToken, authHeader } from '../helpers/auth.helper.js';

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
      const res = await request.get('/api/users').set('Authorization', 'Bearer this.is.invalid');

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

      const res = await request.get('/api/exercises').set(authHeader(memberToken));

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
  });

  describe('INSTRUCTOR role', () => {
    it('is forbidden from GET /api/users (ADMIN only)', async () => {
      const res = await request.get('/api/users').set(authHeader(instructorToken));
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

      const res = await request.get('/api/exercises').set(authHeader(instructorToken));

      expect(res.status).toBe(200);
    });
  });

  describe('ADMIN role', () => {
    it('can GET /api/users', async () => {
      prismaMock.user.findMany.mockResolvedValue([]);

      const res = await request.get('/api/users').set(authHeader(adminToken));

      expect(res.status).toBe(200);
    });
  });
});
