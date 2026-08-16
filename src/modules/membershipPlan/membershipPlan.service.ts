import {
  type CreateMembershipPlanInput,
  type UpdateMembershipPlanInput,
  type MembershipPlanResponse,
  MembershipPlanResponseSchema,
} from './membershipPlan.schemas.js';
import type { MembershipPlan } from '../../generated/prisma/client.js';
import type { MembershipPlanRepository } from './membershipPlan.repository.js';
import { NotFoundError } from '../../utils/errors.js';

export class MembershipPlanService {
  constructor(private readonly repository: MembershipPlanRepository) {}

  async getAllPlans(): Promise<MembershipPlanResponse[]> {
    const membershipPlans = await this.repository.getAll();
    return membershipPlans.map((plan) => this.toResponse(plan));
  }

  async getPlanById(id: number): Promise<MembershipPlanResponse> {
    const membershipPlan = await this.repository.getOne(id);
    if (!membershipPlan) {
      throw new NotFoundError(`Plan de membresía con ID ${id} no encontrado`);
    }
    return this.toResponse(membershipPlan);
  }

  async createPlan(plan: CreateMembershipPlanInput): Promise<MembershipPlanResponse> {
    const newPlan = await this.repository.add(plan);
    return this.toResponse(newPlan);
  }

  async updatePlan(id: number, plan: UpdateMembershipPlanInput): Promise<MembershipPlanResponse> {
    const existingPlan = await this.repository.getOne(id);
    if (!existingPlan) {
      throw new NotFoundError(`Plan de membresía con ID ${id} no encontrado`);
    }
    const updatedPlan = await this.repository.update(id, plan);
    return this.toResponse(updatedPlan);
  }

  async deletePlan(id: number): Promise<void> {
    const existingPlan = await this.repository.getOne(id);
    if (!existingPlan) {
      throw new NotFoundError(`Plan de membresía con ID ${id} no encontrado`);
    }
    await this.repository.delete(id);
  }

  private toResponse(plan: MembershipPlan): MembershipPlanResponse {
    return MembershipPlanResponseSchema.parse(plan);
  }
}
