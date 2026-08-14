import { CreateMemberInput, UpdateMemberInput } from './member.schemas.js';
import { Member } from '../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';

export class MemberRepository {
  async getAll(): Promise<Member[]> {
    return await prisma.member.findMany({
      where: { deletedAt: null },
      // orderBy: { createdAt: 'desc' },
    });
  }

  async getOne(id: number): Promise<Member | undefined> {
    const member = await prisma.member.findFirst({
      where: { id, deletedAt: null },
    });
    return member ?? undefined;
  }

  async add(props: CreateMemberInput): Promise<Member> {
    // Validar email único ANTES de insertar
    const existing = await prisma.member.findUnique({
      where: { email: props.email },
    });
    if (existing) {
      throw new Error('Email ya existe');
    }
    const { membershipPlanId, ...memberData } = props;
    const memberDataFormatted = {
      ...memberData,
      birthDate: new Date(memberData.birthDate + 'T00:00:00'),
    };
    const member = await prisma.member.create({
      data: memberDataFormatted,
    });

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    await prisma.membership.create({
      data: {
        memberId: member.id,
        membershipPlanId: membershipPlanId,
        endDate: endDate,
        status: 'ACTIVE',
      },
    });
    return member;
  }

  async update(
    id: number,
    props: UpdateMemberInput,
  ): Promise<Member | undefined> {
    try {
      return await prisma.member.update({
        where: { id },
        data: {
          name: props.name,
          surname: props.surname,
          email: props.email,
          birthDate: props.birthDate
            ? new Date(props.birthDate + 'T00:00:00')
            : undefined,
          phone: props.phone ?? null,
          status: props.status ?? 'ACTIVE',
        },
      });
    } catch (error) {
      return undefined;
    }
  }

  async delete(id: number): Promise<void> {
    await prisma.member.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
