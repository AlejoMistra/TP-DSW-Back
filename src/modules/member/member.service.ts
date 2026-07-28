import { Member } from '../../generated/prisma/client.js';
import { MemberRepository } from './member.repository.js';
import { CreateMemberInput, UpdateMemberInput } from './member.schemas.js';

export class MemberService {
  constructor(private memberRepository: MemberRepository) {}


  async getAll(): Promise<Member[]> {
    return await this.memberRepository.getAllMembers();
  }

  async getById(id: number): Promise<Member> {
    const member = await this.memberRepository.getMemberById(id);
    if (!member) {
      throw new Error('Socio no encontrado');
    }
    return member;
  }

  async create(props: CreateMemberInput): Promise<Member> {
    return await this.memberRepository.create(props);
  }

  async update(id: number, props: UpdateMemberInput): Promise<Member> {
    // Validar que exista el member
    const member = await this.memberRepository.getMemberById(id);
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
    const member = await this.memberRepository.getMemberById(id);
    if (!member) {
      throw new Error('Socio no encontrado');
    }
    
    await this.memberRepository.delete(id);
  }
}