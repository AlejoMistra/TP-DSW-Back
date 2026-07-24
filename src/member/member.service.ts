import { MemberRepository } from '../member/member.repository.js';
import { MemberProps } from './member.entity.js';
import { CreateMemberInput, UpdateMemberInput } from './member.schemas.js';

export class MemberService {
  constructor(private memberRepository: MemberRepository) {}

  async getAll() {
    //Aca va la logica de negocio, validaciones, etc. Por ejemplo ocultar algun dato o agregar algun campo calculado.

    return await this.memberRepository.getAllMembers();
  }

  async getById(id: number): Promise<MemberProps> {
    //Aca va la logica de negocio, validaciones, etc. Por ejemplo ocultar algun dato o agregar algun campo calculado.
    const member = await this.memberRepository.getMemberById(id);
    if (!member) {
      throw new Error('Socio no encontrado');
    }

    return member;
  }

  async create(props: CreateMemberInput): Promise<MemberProps> {
    const newMember = await this.memberRepository.create({
      ...props,
      joinDate: new Date(),
    });
    return newMember;
  }

  async update(id: number, props: UpdateMemberInput): Promise<MemberProps> {
    const updatedMember = await this.memberRepository.save(id, props);
    if (!updatedMember) {
      throw new Error('Socio no encontrado');
    }
    return updatedMember;
  }

  async delete(id: number): Promise<boolean> {
    return await this.memberRepository.delete(id);
  }
}
