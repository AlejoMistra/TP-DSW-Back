import { Member } from '../../generated/prisma/client.js';
import { MemberRepository } from './member.repository.js';
import { CreateMemberInput, UpdateMemberInput } from './member.schemas.js';

export class MemberService {
  constructor(private memberRepository: MemberRepository) {}

  async getAll(): Promise<Member[]> {
    return await this.memberRepository.getAll();
  }

  async getById(id: number): Promise<Member> {
    const member = await this.memberRepository.getOne(id);
    if (!member) {
      throw new Error('Socio no encontrado');
    }
    return member;
  }

  async getAllWithMembership() {
    try {
      const members = await this.memberRepository.getAllWithMembership();
      return members;
    } catch (error) {
      throw error;
    }
  }

  async create(props: CreateMemberInput): Promise<Member> {
    return await this.memberRepository.add(props);
  }

  async update(id: number, props: UpdateMemberInput): Promise<Member> {
    // Validar que exista el member
    const member = await this.memberRepository.getOne(id);
    if (!member) {
      throw new Error('Socio no encontrado');
    }

    const updatedMember = await this.memberRepository.update(id, props);
    if (!updatedMember) {
      throw new Error('Error al actualizar el socio');
    }
    return updatedMember;
  }

  async delete(id: number): Promise<void> {
    const member = await this.memberRepository.getOne(id);
    if (!member) {
      throw new Error('Socio no encontrado');
    }

    await this.memberRepository.delete(id);
  }
}
// TODO: Agregar toResponse
