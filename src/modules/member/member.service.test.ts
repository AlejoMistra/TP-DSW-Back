import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemberService } from './member.service.js';
import type { MemberRepository } from './member.repository.js';
import type { UserRepository } from '../user/user.repository.js';
import type { MembershipRepository } from '../membership/membership.repository.js';
import type { MembershipPlanRepository } from '../membershipPlan/membershipPlan.repository.js';
import type { PaymentRepository } from '../payment/payment.repository.js';
import { MembershipService } from '../membership/membership.service.js';
import { ConflictError } from '../../utils/errors.js';
import { prisma } from '../../lib/prisma.js';

vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    $transaction: vi.fn(),
  },
}));

describe('MemberService', () => {
  let memberRepository: any;
  let userRepository: any;
  let membershipRepository: any;
  let membershipPlanRepository: any;
  let paymentRepository: any;
  let membershipService: any;
  let memberService: MemberService;

  beforeEach(() => {
    memberRepository = {
      getAll: vi.fn(),
      count: vi.fn(),
      getOne: vi.fn(),
      getByUserId: vi.fn(),
      getByUserIdWithDeleted: vi.fn(),
      findByDoc: vi.fn(),
      findByDocWithDeleted: vi.fn(),
      findByEmail: vi.fn(),
      getAllWithMembership: vi.fn(),
      add: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    userRepository = {
      getAll: vi.fn(),
      count: vi.fn(),
      getOne: vi.fn(),
      findByEmail: vi.fn(),
      add: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    membershipRepository = {
      getAll: vi.fn(),
      count: vi.fn(),
      getById: vi.fn(),
      getByMemberId: vi.fn(),
      getByMemberIdWithDeleted: vi.fn(),
      getByUserId: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateEndDate: vi.fn(),
      delete: vi.fn(),
    };

    membershipPlanRepository = {
      findOne: vi.fn(),
    };

    paymentRepository = {
      create: vi.fn(),
    };

    membershipService = {
      toResponse: vi.fn((m) => ({ ...m, status: m.status ?? 'ACTIVE' })),
    };

    memberService = new MemberService(
      memberRepository as unknown as MemberRepository,
      membershipRepository as unknown as MembershipRepository,
      membershipService as unknown as MembershipService,
      membershipPlanRepository as unknown as MembershipPlanRepository,
      paymentRepository as unknown as PaymentRepository,
      userRepository as unknown as UserRepository,
    );
  });

  describe('create - validations and reactivation', () => {
    it('throws ConflictError if an active member exists with the same document', async () => {
      memberRepository.findByDoc.mockResolvedValue({ id: 10, docNumber: '12345678' });

      await expect(
        memberService.create({
          name: 'Juan',
          surname: 'Perez',
          phone: '1122334455',
          docType: 'DNI',
          docNumber: '12345678',
          status: 'ACTIVE',
          birthDate: new Date('1990-01-01'),
          email: 'juan@example.com',
          membershipPlanId: 1,
        }),
      ).rejects.toThrow(ConflictError);

      expect(memberRepository.findByDoc).toHaveBeenCalledWith('DNI', '12345678');
    });

    it('throws ConflictError if an active user exists with the same email', async () => {
      memberRepository.findByDoc.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue({ id: 5, email: 'juan@example.com', deletedAt: null });

      await expect(
        memberService.create({
          name: 'Juan',
          surname: 'Perez',
          phone: '1122334455',
          docType: 'DNI',
          docNumber: '12345678',
          status: 'ACTIVE',
          birthDate: new Date('1990-01-01'),
          email: 'juan@example.com',
          membershipPlanId: 1,
        }),
      ).rejects.toThrow(ConflictError);
    });

    it('reactivates a deleted member when matching document was soft-deleted', async () => {
      memberRepository.findByDoc.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue(null);

      const deletedMember = {
        id: 10,
        userId: 20,
        name: 'Juan',
        surname: 'Perez',
        docType: 'DNI',
        docNumber: '12345678',
        deletedAt: new Date(),
        status: 'INACTIVE',
      };
      memberRepository.findByDocWithDeleted.mockResolvedValue(deletedMember);
      membershipPlanRepository.findOne.mockResolvedValue({ id: 1, durationDays: 30 });

      const reactivatedMember = {
        ...deletedMember,
        birthDate: new Date('1990-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'ACTIVE',
        deletedAt: null,
        user: { email: 'juan@example.com' },
      };
      const reactivatedMembership = {
        id: 99,
        memberId: 10,
        membershipPlanId: 1,
        startDate: new Date(),
        endDate: new Date(),
        status: 'ACTIVE',
      };

      (prisma.$transaction as any).mockImplementation(async (callback: any) => {
        return callback({
          user: userRepository,
          member: memberRepository,
          membership: membershipRepository,
          payment: paymentRepository,
        });
      });

      memberRepository.update.mockResolvedValue(reactivatedMember);
      membershipRepository.getByMemberIdWithDeleted.mockResolvedValue({ id: 99 });
      membershipRepository.update.mockResolvedValue(reactivatedMembership);

      const result = await memberService.create({
        name: 'Juan',
        surname: 'Perez',
        phone: '1122334455',
        docType: 'DNI',
        docNumber: '12345678',
        status: 'ACTIVE',
        birthDate: new Date('1990-01-01'),
        email: 'juan@example.com',
        membershipPlanId: 1,
      });

      expect(userRepository.update).toHaveBeenCalledWith(
        20,
        expect.objectContaining({
          accountStatus: 'PENDING_ACTIVATION',
          deletedAt: null,
          isActive: true,
        }),
        expect.anything(),
      );

      expect(memberRepository.update).toHaveBeenCalledWith(
        10,
        expect.objectContaining({
          status: 'ACTIVE',
          deletedAt: null,
        }),
        expect.anything(),
      );

      expect(result.id).toBe(10);
      expect(result.email).toBe('juan@example.com');
    });
  });
});
