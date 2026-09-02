import { prisma } from '../../lib/prisma.js';
import type { Member } from '../../generated/prisma/client.js';
import { MemberRepository } from './member.repository.js';
import { MembershipRepository } from '../membership/membership.repository.js';
import { MembershipService } from '../membership/membership.service.js';
import { MembershipPlanRepository } from '../membershipPlan/membershipPlan.repository.js';
import {
  CreateMemberInput,
  MemberResponse,
  MemberResponseSchema,
  UpdateMemberInput,
} from './member.schemas.js';
import { ConflictError, NotFoundError } from '../../utils/errors.js';

export class MemberService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly membershipService: MembershipService,
    private readonly membershipPlanRepository: MembershipPlanRepository,
  ) {}

  async getAll(): Promise<MemberResponse[]> {
    const members = await this.memberRepository.getAll();
    return members.map((member) => this.toResponse(member));
  }

  async getById(id: number): Promise<MemberResponse> {
    const member = await this.memberRepository.getOne(id);
    if (!member) {
      throw new NotFoundError(`Socio con ID ${id} no encontrado`);
    }
    return this.toResponse(member);
  }

  async getAllWithMembership() {
    const members = await this.memberRepository.getAllWithMembership();
    return members.map((member) => {
      const { membership, ...rest } = member;
      if (!membership) {
        return { ...rest, membership: null };
      }
      const { membershipPlan, ...membershipFields } = membership;
      return {
        ...rest,
        membership: {
          ...this.membershipService.toResponse(membershipFields),
          membershipPlan,
        },
      };
    });
  }

  async create(input: CreateMemberInput): Promise<MemberResponse> {
    const existing = await this.memberRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError('El email ingresado ya existe');
    }

    const { membershipPlanId, ...memberData } = input;

    const membershipPlan = await this.membershipPlanRepository.findOne(membershipPlanId);
    if (!membershipPlan) {
      throw new NotFoundError(`Plan de membresía con ID ${membershipPlanId} no encontrado`);
    }

    // Member + Membership inicial se crean atómicamente para no dejar socios sin membresía.
    const member = await prisma.$transaction(async (tx) => {
      const newMember = await this.memberRepository.add(memberData, tx);

      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + membershipPlan.durationDays);

      await this.membershipRepository.create(
        {
          memberId: newMember.id,
          membershipPlanId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          status: 'ACTIVE',
        },
        tx,
      );

      return newMember;
    });

    return this.toResponse(member);
  }

  async update(id: number, input: UpdateMemberInput): Promise<MemberResponse> {
    const member = await this.memberRepository.getOne(id);
    if (!member) {
      throw new NotFoundError(`Socio con ID ${id} no encontrado`);
    }

    const updatedMember = await this.memberRepository.update(id, input);
    return this.toResponse(updatedMember);
  }

  async delete(id: number): Promise<void> {
    const member = await this.memberRepository.getOne(id);
    if (!member) {
      throw new NotFoundError(`Socio con ID ${id} no encontrado`);
    }

    await this.memberRepository.delete(id);
  }

  private toResponse(member: Member): MemberResponse {
    return MemberResponseSchema.parse(member);
  }
}
