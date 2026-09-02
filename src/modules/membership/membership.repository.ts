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
        startDate: membership.startDate,
        endDate: membership.endDate,
        status: membership.status,
      },
    });
  }

  async update(
    id: number,
    membership: UpdateMembershipInput,
    db: DbClient = prisma,
  ): Promise<Membership> {
    const data: Prisma.MembershipUpdateInput = {};

    if (membership.memberId !== undefined) {
      data.member = { connect: { id: membership.memberId } };
    }
    if (membership.membershipPlanId !== undefined) {
      data.membershipPlan = { connect: { id: membership.membershipPlanId } };
    }
    if (membership.startDate !== undefined) {
      data.startDate = membership.startDate;
    }
    if (membership.endDate !== undefined) {
      data.endDate = membership.endDate;
    }
    if (membership.status !== undefined) {
      data.status = membership.status;
    }

    return db.membership.update({
      where: { id },
      data,
    });
  }

  async updateEndDate(id: number, endDate: Date): Promise<Membership> {
    return prisma.membership.update({
      where: { id },
      data: { endDate },
    });
  }

  async delete(id: number, db: DbClient = prisma): Promise<Membership> {
    return db.membership.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
