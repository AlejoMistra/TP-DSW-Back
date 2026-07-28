import { CreateMemberInput, UpdateMemberInput } from './member.schemas.js';
import { Member } from '../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';

export class MemberRepository {
  
  async getAllMembers(): Promise<Member[]> {
    return await prisma.member.findMany({
      where: { deletedAt: null },
      // orderBy: { createdAt: 'desc' },
    });
  }

  async getMemberById(id: number): Promise<Member | null> {
    return await prisma.member.findUnique({
      where: { id },
    });
  }

  async create(props: CreateMemberInput): Promise<Member> {
  // Validar email único ANTES de insertar
    const existing = await prisma.member.findUnique({
       where: { email: props.email }
    });
    if (existing) {
       throw new Error('Email ya existe');
    }

   return await prisma.member.create({
     data: props,
    });

  }

  async update(id: number, props: UpdateMemberInput): Promise<Member | null> {
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
  }

  async delete(id: number): Promise<void> {
    await prisma.member.delete({
      where: { id },
    });
  }
}