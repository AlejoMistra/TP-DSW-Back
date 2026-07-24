import MembersMock from './members.json' with { type: 'json' }; //por ahora es un json con socios, depues una bd
import { MemberProps, MemberStatus } from './member.entity.js';
import { Repository } from '../shared/base.repository.js';

import { PrismaClient } from '@prisma/client';

export class MemberRepository implements Repository<MemberProps> {
  private members: MemberProps[];

  constructor() {
    //simula la carga de dados desde una BD a memoria
    this.members = MembersMock.map((member) => ({
      ...member,
      joinDate: new Date(member.joinDate),
      status: member.status as MemberStatus,
    }));
  }

  async getAll(): Promise<MemberProps[]> {
    return Promise.resolve(this.members);
  }

  async getOne(id: number): Promise<MemberProps | undefined> {
    const member = this.members.find((s) => s.id === id);
    return Promise.resolve(member);
  }

  async add(item: Omit<MemberProps, 'id'>): Promise<MemberProps> {
    const newId = Math.max(...this.members.map((m) => m.id), 0) + 1;
    const newMember: MemberProps = {
      id: newId,
      ...item,
    };
    this.members.push(newMember);
    return Promise.resolve(newMember);
  }

  async update(
    id: number,
    item: Partial<Omit<MemberProps, 'id'>>,
  ): Promise<MemberProps | undefined> {
    const member = this.members.find((m) => m.id === id);
    if (!member) return Promise.resolve(undefined);

    const updated = { ...member, ...item };
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
