import type {
  CreateMembershipInput,
  UpdateMembershipInput,
} from './membership.schemas.js';
import { prisma } from '../../lib/prisma.js';
import type { Membership } from '../../generated/prisma/client';

export class MembershipRepository {
  async getAll(): Promise<Membership[]> {
    return prisma.membership.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async getById(id: number): Promise<Membership | null> {
    return prisma.membership.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async getByMemberId(memberId: number): Promise<Membership | null> {
    return await prisma.membership.findUnique({
      where: { memberId },
    });
  }

  async create(membership: CreateMembershipInput): Promise<Membership> {
    return prisma.membership.create({
      data: {
        member: { connect: { id: membership.memberId } },
        membershipPlan: { connect: { id: membership.membershipPlanId } },
        startDate: new Date(membership.startDate),
        endDate: new Date(membership.endDate),
        lastPaymentMethod: membership.lastPaymentMethod ?? undefined,
        lastPaymentDate: membership.lastPaymentDate
          ? new Date(membership.lastPaymentDate)
          : undefined,
        lastPaymentAmount: membership.lastPaymentAmount ?? undefined,
      },
      include: {
        member: true,
        membershipPlan: true,
      },
    });
  }

  async update(
    id: number,
    membership: UpdateMembershipInput,
  ): Promise<Membership> {
    return prisma.membership.update({
      where: { id },
      data: {
        member: membership.memberId
          ? { connect: { id: membership.memberId } }
          : undefined,
        membershipPlan: membership.membershipPlanId
          ? { connect: { id: membership.membershipPlanId } }
          : undefined,
        startDate: membership.startDate
          ? new Date(membership.startDate)
          : undefined,
        endDate: membership.endDate ? new Date(membership.endDate) : undefined,
        lastPaymentMethod: membership.lastPaymentMethod,
        lastPaymentDate: membership.lastPaymentDate
          ? new Date(membership.lastPaymentDate)
          : undefined,
        lastPaymentAmount: membership.lastPaymentAmount ?? undefined,
      },
    });
  }

  async delete(id: number): Promise<Membership> {
    return prisma.membership.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
