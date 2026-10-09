import {
  type CreateMembershipPlanInput,
  type UpdateMembershipPlanInput,
  type MembershipPlanResponse,
  MembershipPlanResponseSchema,
} from './membershipPlan.schemas.js';
import type { MembershipPlan } from '../../generated/prisma/client.js';
import type { MembershipPlanRepository } from './membershipPlan.repository.js';
import { NotFoundError } from '../../utils/errors.js';

import { type PaginatedResponse } from '../../shared/pagination.js';

export class MembershipPlanService {
  constructor(private readonly repository: MembershipPlanRepository) {}

  async findAll(page = 1, limit = 10): Promise<PaginatedResponse<MembershipPlanResponse>> {
    const [membershipPlans, total] = await Promise.all([
      this.repository.findAll(page, limit),
      this.repository.count(),
    ]);
    return {
      items: membershipPlans.map((plan) => this.toResponse(plan)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findOne(id: number): Promise<MembershipPlanResponse> {
    const membershipPlan = await this.repository.findOne(id);
    if (!membershipPlan) {
      throw new NotFoundError(`Plan de membresía con ID ${id} no encontrado`);
    }
    return this.toResponse(membershipPlan);
  }

  async create(plan: CreateMembershipPlanInput): Promise<MembershipPlanResponse> {
    const newPlan = await this.repository.create(plan);
    return this.toResponse(newPlan);
  }

  async update(id: number, plan: UpdateMembershipPlanInput): Promise<MembershipPlanResponse> {
    const existingPlan = await this.repository.findOne(id);
    if (!existingPlan) {
      throw new NotFoundError(`Plan de membresía con ID ${id} no encontrado`);
    }
    const updatedPlan = await this.repository.update(id, plan);
    return this.toResponse(updatedPlan);
  }

  async remove(id: number): Promise<void> {
    const existingPlan = await this.repository.findOne(id);
    if (!existingPlan) {
      throw new NotFoundError(`Plan de membresía con ID ${id} no encontrado`);
    }
    await this.repository.remove(id);
  }

  private toResponse(plan: MembershipPlan): MembershipPlanResponse {
    return MembershipPlanResponseSchema.parse(plan);
  }
}
