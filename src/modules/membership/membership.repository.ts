import type {
  CreateMembershipInput,
  UpdateMembershipInput,
} from './membership.schemas.js';
import { prisma } from '../../lib/prisma.js';
import type { Membership, Prisma } from '../../generated/prisma/client.js';

type DbClient = Prisma.TransactionClient | typeof prisma;

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
    return prisma.membership.findFirst({
      where: { memberId, deletedAt: null },
    });
  }

  async create(
    membership: CreateMembershipInput,
    db: DbClient = prisma,
  ): Promise<Membership> {
    return db.membership.create({
      data: {
        member: { connect: { id: membership.memberId } },
        membershipPlan: { connect: { id: membership.membershipPlanId } },
        startDate: new Date(membership.startDate),
        endDate: new Date(membership.endDate),
        status: membership.status,
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
        status: membership.status,
      },
    });
  }

  async updateEndDate(id: number, endDate: Date): Promise<Membership> {
    return prisma.membership.update({
      where: { id },
      data: { endDate },
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
