import 'dotenv/config';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import bcrypt from 'bcrypt';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import supertest from 'supertest';
import { prismaMock } from '../mocks/prisma.mock.js';
import { app } from '../../src/app.js';
import type { User, Member, Instructor } from '../../src/generated/prisma/client.js';

function buildUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    email: 'user@example.com',
    passwordHash: null,
    accountStatus: 'PENDING_ACTIVATION',
    role: 'MEMBER',
    isActive: true,
    failedLoginAttempts: 0,
    lockedUntil: null,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides,
  } as User;
}

function buildMember(overrides: Partial<Member> = {}): Member {
  return {
    id: 1,
    name: 'Carlos',
    surname: 'Test',
    phone: null,
    docType: 'DNI',
    docNumber: '99887766',
    birthDate: new Date('1995-05-15'),
    status: 'ACTIVE',
    userId: 1,
    ...overrides,
  } as Member;
}

function buildInstructor(overrides: Partial<Instructor> = {}): Instructor {
  return {
    id: 1,
    name: 'Laura',
    surname: 'Perez',
    phone: '1144556677',
    docType: 'DNI',
    docNumber: '44556677',
    joinDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    userId: 2,
    ...overrides,
  } as Instructor;
}

describe('Auth flow (login, activation) — mocked Prisma', () => {
  let server: http.Server;
  let request: ReturnType<typeof supertest>;

  beforeAll(async () => {
    server = http.createServer(app);
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const { port } = server.address() as AddressInfo;
    request = supertest(`http://localhost:${port}/api`);
  });

  afterAll(() => {
    server.close();
  });

  describe('POST /auth/login', () => {
    it('logs in an ACTIVE user with the correct password', async () => {
      const passwordHash = await bcrypt.hash('admin1234', 4);
      prismaMock.user.findUnique.mockResolvedValue({
        ...buildUser({ accountStatus: 'ACTIVE', role: 'ADMIN', passwordHash }),
        member: null,
        instructor: null,
      } as never);
      prismaMock.user.update.mockResolvedValue(buildUser());

      const res = await request.post('/auth/login').send({
        email: 'admin@gym.com',
        password: 'admin1234',
      });

      expect(res.status).toBe(200);
      expect(res.body.user.role).toBe('ADMIN');
      expect(res.body.token).toBeTruthy();
    });

    it('rejects login while the account is pending activation', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        ...buildUser({ accountStatus: 'PENDING_ACTIVATION' }),
        member: buildMember(),
        instructor: null,
      } as never);

      const res = await request.post('/auth/login').send({
        email: 'user@example.com',
        password: 'somepassword',
      });

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/activar/);
    });

    it('rejects login with the wrong password and records the failed attempt', async () => {
      const passwordHash = await bcrypt.hash('SecurePassword123!', 4);
      prismaMock.user.findUnique.mockResolvedValue({
        ...buildUser({ accountStatus: 'ACTIVE', passwordHash }),
        member: buildMember(),
        instructor: null,
      } as never);
      prismaMock.user.update.mockResolvedValue(buildUser());

      const res = await request.post('/auth/login').send({
        email: 'user@example.com',
        password: 'wrong_password',
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Credenciales inválidas');
      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ failedLoginAttempts: 1 }) }),
      );
    });

    it('returns a token for an activated instructor', async () => {
      const passwordHash = await bcrypt.hash('InstructorPassword123!', 4);
      prismaMock.user.findUnique.mockResolvedValue({
        ...buildUser({ id: 2, accountStatus: 'ACTIVE', role: 'INSTRUCTOR', passwordHash }),
        member: null,
        instructor: buildInstructor(),
      } as never);
      prismaMock.user.update.mockResolvedValue(buildUser());

      const res = await request.post('/auth/login').send({
        email: 'instructor@example.com',
        password: 'InstructorPassword123!',
      });

      expect(res.status).toBe(200);
      expect(res.body.user.role).toBe('INSTRUCTOR');
    });
  });

  describe('POST /auth/activate-account', () => {
    it('returns the same generic error for a nonexistent email (no user enumeration)', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const res = await request.post('/auth/activate-account').send({
        email: 'doesnotexist@example.com',
        name: 'Carlos',
        surname: 'Test',
        docNumber: '99887766',
        newPassword: 'SecurePassword123!',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('No se pudieron verificar los datos');
    });

    it('rejects activation with mismatched identity data', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        ...buildUser({ accountStatus: 'PENDING_ACTIVATION' }),
        member: buildMember(),
        instructor: null,
      } as never);

      const res = await request.post('/auth/activate-account').send({
        email: 'user@example.com',
        name: 'WrongName',
        surname: 'Test',
        docNumber: '99887766',
        newPassword: 'SecurePassword123!',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('No se pudieron verificar los datos');
    });

    it('activates the account when identity data matches (case-insensitive)', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        ...buildUser({ accountStatus: 'PENDING_ACTIVATION' }),
        member: buildMember(),
        instructor: null,
      } as never);
      prismaMock.user.update.mockResolvedValue(buildUser({ accountStatus: 'ACTIVE' }));

      const res = await request.post('/auth/activate-account').send({
        email: 'user@example.com',
        name: 'carlos',
        surname: 'test',
        docNumber: '99887766',
        newPassword: 'SecurePassword123!',
      });

      expect(res.status).toBe(200);
      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ accountStatus: 'ACTIVE' }) }),
      );
    });

    it('rejects re-activation of an already ACTIVE account', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        ...buildUser({ accountStatus: 'ACTIVE' }),
        member: buildMember(),
        instructor: null,
      } as never);

      const res = await request.post('/auth/activate-account').send({
        email: 'user@example.com',
        name: 'Carlos',
        surname: 'Test',
        docNumber: '99887766',
        newPassword: 'AnotherPassword123!',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('La cuenta ya está activada, por favor inicia sesión');
    });
  });
});
