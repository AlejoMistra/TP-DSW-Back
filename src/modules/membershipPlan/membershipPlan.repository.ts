import { CreatePlanInput, UpdatePlanInput } from './membershipPlan.schemas.js';
import { prisma } from '../../lib/prisma.js';
import type { MembershipPlan } from '../../generated/prisma/client';
import { Repository } from '../../shared/base.repository.js';

export class MembershipPlanRepository implements Repository<MembershipPlan> {
  
  async getAll(): Promise<MembershipPlan[]> {
    return prisma.membershipPlan.findMany();
  }

  async getOne(id: number): Promise<MembershipPlan | null> {
    return prisma.membershipPlan.findUnique({
      where: { id },
    });
  }

  async add(membershipPlan: CreatePlanInput): Promise<MembershipPlan> {
    return prisma.membershipPlan.create({
      data: {
        name: membershipPlan.name,
        description: membershipPlan.description,
        price: membershipPlan.price,
        durationDays: membershipPlan.durationDays,
      }
    })
  }
  
  async update(id: number, membershipPlan: UpdatePlanInput): Promise<MembershipPlan> {
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

  async delete(id: number): Promise<void> {
    await prisma.membershipPlan.delete({
      where: { id },
    });
  }
}