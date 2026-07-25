import { CreatePlanInput, UpdatePlanInput, PlanIdSchema } from './membershipPlan.schemas.js';
import { prisma } from '../../lib/prisma.js';
import type { MembershipPlan } from '../../generated/prisma/client';

export class MembershipPlanRepository {
  
  async findAllMembershipPlans(): Promise<MembershipPlan[]> {
    return prisma.membershipPlan.findMany();
  }

  async findMembershipPlanById(id: number): Promise<MembershipPlan | null> {
    return prisma.membershipPlan.findUnique({
      where: { id },
    });
  }

  async createMembershipPlan(membershipPlan: CreatePlanInput): Promise<MembershipPlan> {
    return prisma.membershipPlan.create({
      data: {
        name: membershipPlan.name,
        description: membershipPlan.description,
        price: membershipPlan.price,
        durationDays: membershipPlan.durationDays,
      }
    }
    )
  }
  
  async updateMembershipPlan(id: number, membershipPlan: UpdatePlanInput): Promise<MembershipPlan> {
    return prisma.membershipPlan.update({
      where: { id },
      data: {
        name: membershipPlan.name,
        description: membershipPlan.description,
        price: membershipPlan.price,
        durationDays: membershipPlan.durationDays,
      }
    })
  }

  async deleteMembershipPlan(id: number): Promise<void> {
    await prisma.membershipPlan.delete({
      where: { id },
    });
  }
}