import { CreateMemberInput, UpdateMemberInput } from './member.schemas.js';
import { Member } from '../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import { Repository } from '../../shared/base.repository.js';

export class MemberRepository implements Repository<Member> {
  async getAll(): Promise<Member[]> {
    return await prisma.member.findMany({
      where: { deletedAt: null },
      // orderBy: { createdAt: 'desc' },
    });
  }

  async getOne(id: number): Promise<Member | undefined> {
    const member = await prisma.member.findUnique({
      where: { id },
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

    return await prisma.member.create({
      data: props,
    });
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
          phone: props.phone ?? null,
          status: props.status ?? 'ACTIVE',
        },
      });
    } catch (error) {
      return undefined;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.member.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
