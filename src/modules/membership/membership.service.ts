import {
  CreateMembershipInput,
  MembershipResponse,
  MembershipResponseSchema,
  UpdateMembershipInput,
} from './membership.schemas.js';
import { MembershipRepository } from './membership.repository.js';
import { MembershipPlanRepository } from '../membershipPlan/membershipPlan.repository.js';
import type { Membership } from '../../generated/prisma/client.js';
import { NotFoundError } from '../../utils/errors.js';
import { FREE_TRIAL_DAYS } from '../../shared/constants.js';

export class MembershipService {
  constructor(
    private readonly repository: MembershipRepository,
    private readonly membershipPlanRepository: MembershipPlanRepository,
  ) {}

  async getAll(): Promise<MembershipResponse[]> {
    const memberships = await this.repository.getAll();
    return memberships.map((membership) => this.toResponse(membership));
  }

  async getById(id: number): Promise<MembershipResponse> {
    const membership = await this.repository.getById(id);
    if (!membership) {
      throw new NotFoundError(`Membresía con ID ${id} no encontrada`);
    }

    return this.toResponse(membership);
  }

  async getByMemberId(memberId: number): Promise<MembershipResponse> {
    const membership = await this.repository.getByMemberId(memberId);
    if (!membership) {
      throw new NotFoundError(
        `Membresía para el miembro con ID ${memberId} no encontrada`,
      );
    }
    return this.toResponse(membership);
  }

  async create(input: CreateMembershipInput): Promise<MembershipResponse> {
    const membership = await this.repository.create(input);
    return this.toResponse(membership);
  }

  async update(
    id: number,
    input: UpdateMembershipInput,
  ): Promise<MembershipResponse> {
    const existingMembership = await this.repository.getById(id);
    if (!existingMembership) {
      throw new NotFoundError(`Membresía con ID ${id} no encontrada`);
    }

    // Si cambia el plan, recalcular startDate/endDate desde hoy.
    // Si el body ya trae fechas explícitas, se usan tal cual (override manual admin).
    let updateData = { ...input };

    if (
      input.membershipPlanId !== undefined &&
      input.membershipPlanId !== existingMembership.membershipPlanId &&
      input.startDate === undefined &&
      input.endDate === undefined
    ) {
      const plan = await this.membershipPlanRepository.findOne(input.membershipPlanId);
      if (!plan) {
        throw new NotFoundError(
          `Plan de membresía con ID ${input.membershipPlanId} no encontrado`,
        );
      }

      const startDate = new Date();
      const endDate = new Date(startDate);
      // Sin pago asociado en este endpoint: free trial. Con fechas manuales: las del plan.
      endDate.setDate(startDate.getDate() + FREE_TRIAL_DAYS);

      updateData = { ...updateData, startDate, endDate, status: 'ACTIVE' };
    }

    const membership = await this.repository.update(id, updateData);
    return this.toResponse(membership);
  }

  async delete(id: number): Promise<void> {
    const existingMembership = await this.repository.getById(id);
    if (!existingMembership) {
      throw new NotFoundError(`Membresía con ID ${id} no encontrada`);
    }

    await this.repository.delete(id);
  }

  public toResponse(membership: Membership): MembershipResponse {
    const now = new Date();
    let computedStatus = membership.status as string;
    if (membership.status === 'ACTIVE' && membership.endDate < now) {
      computedStatus = 'EXPIRED';
    }

    return MembershipResponseSchema.parse({
      id: membership.id,
      memberId: membership.memberId,
      membershipPlanId: membership.membershipPlanId,
      startDate: membership.startDate,
      endDate: membership.endDate,
      status: computedStatus,
      createdAt: membership.createdAt,
      updatedAt: membership.updatedAt,
    });
  }
}
