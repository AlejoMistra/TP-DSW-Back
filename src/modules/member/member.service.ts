import { prisma } from '../../lib/prisma.js';
import type { Member } from '../../generated/prisma/client.js';
import { MemberRepository } from './member.repository.js';
import { MembershipRepository } from '../membership/membership.repository.js';
import { MembershipService } from '../membership/membership.service.js';
import { MembershipResponse } from '../membership/membership.schemas.js';
import { MembershipPlanRepository } from '../membershipPlan/membershipPlan.repository.js';
import { PaymentRepository } from '../payment/payment.repository.js';
import { PaymentResponse, PaymentResponseSchema } from '../payment/payment.schemas.js';
import {
  CreateMemberInput,
  MemberResponse,
  MemberResponseSchema,
  UpdateMemberInput,
} from './member.schemas.js';
import { ConflictError, NotFoundError } from '../../utils/errors.js';
import { FREE_TRIAL_DAYS } from '../../shared/constants.js';

export type MemberWithMembershipAndPayment = MemberResponse & {
  membership: MembershipResponse;
  payment: PaymentResponse | null;
};

export class MemberService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly membershipService: MembershipService,
    private readonly membershipPlanRepository: MembershipPlanRepository,
    private readonly paymentRepository: PaymentRepository,
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

  async create(input: CreateMemberInput): Promise<MemberWithMembershipAndPayment> {
    const existing = await this.memberRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError('El email ingresado ya existe');
    }

    const { membershipPlanId, payment, ...memberData } = input;

    const membershipPlan = await this.membershipPlanRepository.findOne(membershipPlanId);
    if (!membershipPlan) {
      throw new NotFoundError(`Plan de membresía con ID ${membershipPlanId} no encontrado`);
    }

    // Member + Membership se crean atómicamente.
    // Sin pago: membresía ACTIVE con free trial de FREE_TRIAL_DAYS días.
    // Con pago: membresía ACTIVE con duración completa del plan.
    const { member, membership, createdPayment } = await prisma.$transaction(async (tx) => {
      const newMember = await this.memberRepository.add(memberData, tx);

      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(
        endDate.getDate() + (payment ? membershipPlan.durationDays : FREE_TRIAL_DAYS),
      );

      const newMembership = await this.membershipRepository.create(
        {
          memberId: newMember.id,
          membershipPlanId,
          startDate,
          endDate,
          status: 'ACTIVE',
        },
        tx,
      );

      const newPayment = payment
        ? await this.paymentRepository.create(
            {
              membershipId: newMembership.id,
              amount: payment.amount,
              method: payment.method,
              paymentDate: payment.paymentDate,
              periodStart: startDate,
              periodEnd: endDate,
            },
            tx,
          )
        : null;

      return { member: newMember, membership: newMembership, createdPayment: newPayment };
    });

    return {
      ...this.toResponse(member),
      membership: this.membershipService.toResponse(membership),
      payment: createdPayment ? PaymentResponseSchema.parse(createdPayment) : null,
    };
  }

  async update(id: number, input: UpdateMemberInput): Promise<MemberResponse> {
    const member = await this.memberRepository.getOne(id);
    if (!member) {
      throw new NotFoundError(`Socio con ID ${id} no encontrado`);
    }

    const { membershipPlanId, payment, ...memberData } = input;

    if (membershipPlanId === undefined) {
      // Sin cambio de plan: actualizar solo datos del socio.
      const updatedMember = await this.memberRepository.update(id, memberData);
      return this.toResponse(updatedMember);
    }

    const membershipPlan = await this.membershipPlanRepository.findOne(membershipPlanId);
    if (!membershipPlan) {
      throw new NotFoundError(
        `Plan de membresía con ID ${membershipPlanId} no encontrado`,
      );
    }

    const membership = await this.membershipRepository.getByMemberId(id);
    if (!membership) {
      throw new NotFoundError(`Membresía para el socio con ID ${id} no encontrada`);
    }

    // Cambio de plan: el período se reinicia desde hoy.
    // Sin pago: free trial de FREE_TRIAL_DAYS días.
    // Con pago: duración completa del nuevo plan.
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(
      endDate.getDate() + (payment ? membershipPlan.durationDays : FREE_TRIAL_DAYS),
    );

    const updatedMember = await prisma.$transaction(async (tx) => {
      const updated = await this.memberRepository.update(id, memberData, tx);
      await this.membershipRepository.update(
        membership.id,
        { membershipPlanId, startDate, endDate, status: 'ACTIVE' },
        tx,
      );

      if (payment) {
        await this.paymentRepository.create(
          {
            membershipId: membership.id,
            amount: payment.amount,
            method: payment.method,
            paymentDate: payment.paymentDate,
            periodStart: startDate,
            periodEnd: endDate,
          },
          tx,
        );
      }

      return updated;
    });

    return this.toResponse(updatedMember);
  }

  async delete(id: number): Promise<void> {
    const member = await this.memberRepository.getOne(id);
    if (!member) {
      throw new NotFoundError(`Socio con ID ${id} no encontrado`);
    }

    const membership = await this.membershipRepository.getByMemberId(id);

    await prisma.$transaction(async (tx) => {
      if (membership) {
        await this.membershipRepository.delete(membership.id, tx);
      }
      await this.memberRepository.delete(id, tx);
    });
  }

  private toResponse(member: Member): MemberResponse {
    return MemberResponseSchema.parse(member);
  }
}
