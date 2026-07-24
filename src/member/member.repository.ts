import MembersMock from './members.json' with { type: 'json' }; //por ahora es un json con socios, depues una bd
import { MemberProps, MemberStatus } from './member.entity.js';

export class MemberRepository {
  private members: MemberProps[];

  constructor() {
    //simula la carga de dados desde una BD a memoria
    this.members = MembersMock.map((member) => ({
      ...member,
      joinDate: new Date(member.joinDate),
      status: member.status as MemberStatus,
    }));
  }

  async getAllMembers(): Promise<MemberProps[]> {
    return Promise.resolve(this.members);
  }

  async getMemberById(id: number): Promise<MemberProps | null> {
    const member = this.members.find((s) => s.id === id);
    return Promise.resolve(member || null);
  }

  async create(props: Omit<MemberProps, 'id'>): Promise<MemberProps> {
    const newId = Math.max(...this.members.map((m) => m.id), 0) + 1;
    const newMember: MemberProps = {
      id: newId,
      ...props,
    };
    this.members.push(newMember);
    return Promise.resolve(newMember);
  }

  async save(
    id: number,
    props: Partial<MemberProps>,
  ): Promise<MemberProps | null> {
    const member = this.members.find((m) => m.id === id);
    if (!member) return Promise.resolve(null);

    const updated = { ...member, ...props };
    const index = this.members.findIndex((m) => m.id === id);
    this.members[index] = updated;
    return Promise.resolve(updated);
  }

  async delete(id: number): Promise<boolean> {
    const index = this.members.findIndex((m) => m.id === id);
    if (index === -1) return Promise.resolve(false);

    this.members.splice(index, 1);
    return Promise.resolve(true);
  }
}
