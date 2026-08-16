import { prisma } from '../../lib/prisma.js';
import type { MembershipPlan } from '../../generated/prisma/client.js';
import { CreateMembershipPlanInput, UpdateMembershipPlanInput } from './membershipPlan.schemas.js';

export class MembershipPlanRepository{
  async getAll(): Promise<MembershipPlan[]> {
    return prisma.membershipPlan.findMany();
  }

  async getOne(id: number): Promise<MembershipPlan | null> {
    return prisma.membershipPlan.findUnique({
      where: { id },
    });
  }

  async add(membershipPlan: CreateMembershipPlanInput): Promise<MembershipPlan> {
    return prisma.membershipPlan.create({
      data: membershipPlan,
    });
  }
  
  async update(id: number, membershipPlan: UpdateMembershipPlanInput): Promise<MembershipPlan> {
    return prisma.membershipPlan.update({
      where: { id },
      data: membershipPlan,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.membershipPlan.delete({
      where: { id },
    });
  }
}