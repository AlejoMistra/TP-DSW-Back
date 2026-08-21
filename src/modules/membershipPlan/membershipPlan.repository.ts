import { prisma } from '../../lib/prisma.js';
import type { MembershipPlan } from '../../generated/prisma/client.js';
import { CreateMembershipPlanInput, UpdateMembershipPlanInput } from './membershipPlan.schemas.js';

export class MembershipPlanRepository{
  async findAll(): Promise<MembershipPlan[]> {
    return prisma.membershipPlan.findMany();
  }

  async findOne(id: number): Promise<MembershipPlan | null> {
    return prisma.membershipPlan.findUnique({
      where: { id },
    });
  }

  async create(membershipPlan: CreateMembershipPlanInput): Promise<MembershipPlan> {
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

  async remove(id: number): Promise<void> {
    await prisma.membershipPlan.delete({
      where: { id },
    });
  }
}