import {
  CreateMembershipInput,
  MembershipResponse,
  MembershipResponseSchema,
  UpdateMembershipInput,
} from './membership.schemas.js';
import { MembershipRepository } from './membership.repository.js';
import type { Membership } from '../../generated/prisma/client.js';

export class MembershipService {
  constructor(private readonly repository: MembershipRepository) {}

  async getAll(): Promise<MembershipResponse[]> {
    const memberships = await this.repository.getAll();
    return memberships.map((membership) => this.toResponse(membership));
  }

  async getById(id: number): Promise<MembershipResponse> {
    const membership = await this.repository.getById(id);
    if (!membership) {
      throw new Error(`Membresía con ID ${id} no encontrada`);
    }

    return this.toResponse(membership);
  }

  async create(input: CreateMembershipInput): Promise<MembershipResponse> {
    const membership = await this.repository.create(input);
    return this.toResponse(membership);
  }

  async update(id: number, input: UpdateMembershipInput): Promise<MembershipResponse> {
    const existingMembership = await this.repository.getById(id);
    if (!existingMembership) {
      throw new Error(`Membresía con ID ${id} no encontrada`);
    }

    const membership = await this.repository.update(id, input);
    return this.toResponse(membership);
  }

  async delete(id: number): Promise<void> {
    const existingMembership = await this.repository.getById(id);
    if (!existingMembership) {
      throw new Error(`Membresía con ID ${id} no encontrada`);
    }

    await this.repository.delete(id);
  }

  //TODO: Validar si esta ok tener este mappeo aca o si deberia estar en membership.mapper.ts
  //Se supone que esto esta bien si es un sistema simple, pero si ya tenemos el toresponse en varios modulos
  //conviene tener un membership.mapper.ts para mantener consistencia. Tambien hay que ver si en schema se espera un ISO o un date
  // porque si se espera un date, el toISOString() deberia cambiar a Date
  private toResponse(membership: Membership): MembershipResponse {
    return MembershipResponseSchema.parse({
      id: membership.id,
      memberId: membership.memberId,
      membershipPlanId: membership.membershipPlanId,
      startDate: membership.startDate.toISOString(),
      endDate: membership.endDate.toISOString(),
      lastPaymentMethod: membership.lastPaymentMethod ?? undefined,
      lastPaymentDate: membership.lastPaymentDate?.toISOString() ?? undefined,
      lastPaymentAmount: membership.lastPaymentAmount?.toNumber() ?? undefined,
    });
  }
}