import { CreateMemberInput, UpdateMemberInput } from './member.schemas.js';
import {
  Member,
  Membership,
  MembershipPlan,
  Prisma,
} from '../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';

type DbClient = Prisma.TransactionClient | typeof prisma;
// El membershipPlanId se resuelve a nivel de servicio (creación de la Membership); el repo de Member no lo conoce.
type CreateMemberData = Omit<CreateMemberInput, 'membershipPlanId'>;

export class MemberRepository {
  async getAll(): Promise<Member[]> {
    return prisma.member.findMany({
      where: { deletedAt: null },
    });
  }

  async getOne(id: number): Promise<Member | null> {
    return prisma.member.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findByEmail(email: string): Promise<Member | null> {
    return prisma.member.findUnique({ where: { email } });
  }

  async getAllWithMembership(): Promise<
    (Member & {
      membership: (Membership & { membershipPlan: MembershipPlan }) | null;
    })[]
  > {
    return prisma.member.findMany({
      where: { deletedAt: null },
      include: {
        membership: {
          include: {
            membershipPlan: true,
          },
        },
      },
    });
  }

  async add(props: CreateMemberData, db: DbClient = prisma): Promise<Member> {
    return db.member.create({ data: props });
  }

  async update(
    id: number,
    memberData: Omit<UpdateMemberInput, 'membershipPlanId'>,
    db: DbClient = prisma,
  ): Promise<Member> {
    return db.member.update({
      where: { id },
      data: memberData,
    });
  }

  async delete(id: number, db: DbClient = prisma): Promise<void> {
    await db.member.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'INACTIVE' },
    });
  }
}
