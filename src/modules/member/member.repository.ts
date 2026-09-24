import { CreateMemberInput, UpdateMemberInput } from './member.schemas.js';
import {
  Member,
  Membership,
  MembershipPlan,
  Prisma,
  User,
} from '../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';

type DbClient = Prisma.TransactionClient | typeof prisma;

export type MemberWithUser = Member & { user: User };
export type MemberWithUserAndMembership = Member & {
  user: User;
  membership: (Membership & { membershipPlan: MembershipPlan }) | null;
};

export type CreateMemberData = Omit<CreateMemberInput, 'membershipPlanId' | 'email'> & {
  userId: number;
};
export type UpdateMemberData = Omit<UpdateMemberInput, 'membershipPlanId' | 'email'>;

export class MemberRepository {
  async getAll(): Promise<MemberWithUser[]> {
    return prisma.member.findMany({
      where: { deletedAt: null },
      include: { user: true },
    });
  }

  async getOne(id: number): Promise<MemberWithUser | null> {
    return prisma.member.findFirst({
      where: { id, deletedAt: null },
      include: { user: true },
    });
  }

  async findByEmail(email: string): Promise<MemberWithUser | null> {
    return prisma.member.findFirst({
      where: {
        deletedAt: null,
        user: { email },
      },
      include: { user: true },
    });
  }

  async getAllWithMembership(): Promise<MemberWithUserAndMembership[]> {
    return prisma.member.findMany({
      where: { deletedAt: null },
      include: {
        user: true,
        membership: {
          include: {
            membershipPlan: true,
          },
        },
      },
    });
  }

  async add(props: CreateMemberData, db: DbClient = prisma): Promise<MemberWithUser> {
    return db.member.create({
      data: props,
      include: { user: true },
    });
  }

  async update(
    id: number,
    memberData: UpdateMemberData,
    db: DbClient = prisma,
  ): Promise<MemberWithUser> {
    return db.member.update({
      where: { id },
      data: memberData,
      include: { user: true },
    });
  }

  async delete(id: number, db: DbClient = prisma): Promise<void> {
    await db.member.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'INACTIVE' },
    });
  }
}
