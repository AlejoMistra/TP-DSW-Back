import { prisma } from '../../lib/prisma.js';
import { MemberRepository, MemberWithUser } from './member.repository.js';
import { UserRepository } from '../user/user.repository.js';
import { MembershipRepository } from '../membership/membership.repository.js';
import { MembershipService } from '../membership/membership.service.js';
import { MembershipResponse } from '../membership/membership.schemas.js';
import { MembershipPlanRepository } from '../membershipPlan/membershipPlan.repository.js';
import { PaymentRepository } from '../payment/payment.repository.js';
import {
  PaymentResponse,
  PaymentResponseSchema,
} from '../payment/payment.schemas.js';
import {
  CreateMemberInput,
  MemberResponse,
  MemberResponseSchema,
  UpdateMemberInput,
  UpdateMyProfileInput,
} from './member.schemas.js';
import { ConflictError, NotFoundError } from '../../utils/errors.js';
import { FREE_TRIAL_DAYS } from '../../shared/constants.js';

import { type PaginatedResponse } from '../../shared/pagination.js';

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
    private readonly userRepository: UserRepository,
  ) {}

  async getAll(
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<MemberResponse>> {
    const [members, total] = await Promise.all([
      this.memberRepository.getAll(page, limit),
      this.memberRepository.count(),
    ]);
    return {
      items: members.map((member) => this.toResponse(member)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async getById(id: number): Promise<MemberResponse> {
    const member = await this.memberRepository.getOne(id);
    if (!member) {
      throw new NotFoundError(`Socio con ID ${id} no encontrado`);
    }
    return this.toResponse(member);
  }

  async getMe(userId: number): Promise<MemberResponse> {
    const member = await this.memberRepository.getByUserId(userId);
    if (!member) {
      throw new NotFoundError('Socio no encontrado');
    }
    return this.toResponse(member);
  }

  async updateMe(
    userId: number,
    input: UpdateMyProfileInput,
  ): Promise<MemberResponse> {
    const member = await this.memberRepository.getByUserId(userId);
    if (!member) {
      throw new NotFoundError('Socio no encontrado');
    }
    return this.update(member.id, input);
  }

  async getAllWithMembership(
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<any>> {
    const [members, total] = await Promise.all([
      this.memberRepository.getAllWithMembership(page, limit),
      this.memberRepository.count(),
    ]);

    const items = members.map((member) => {
      const { membership, user, ...rest } = member;
      const baseMember = {
        ...rest,
        email: user.email,
      };

      if (!membership) {
        return { ...baseMember, membership: null };
      }
      const { membershipPlan, ...membershipFields } = membership;
      return {
        ...baseMember,
        membership: {
          ...this.membershipService.toResponse(membershipFields),
          membershipPlan,
        },
      };
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async create(
    input: CreateMemberInput,
  ): Promise<MemberWithMembershipAndPayment> {
    const existingMemberByDoc = await this.memberRepository.findByDoc(
      input.docType,
      input.docNumber,
    );
    if (existingMemberByDoc) {
      throw new ConflictError('Ya existe un socio activo con ese documento');
    }

    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser && existingUser.deletedAt === null) {
      throw new ConflictError('El email ingresado ya existe');
    }

    // Comprobar si existe un socio previamente dado de baja (por DNI o por Email)
    let deletedMember = await this.memberRepository.findByDocWithDeleted(
      input.docType,
      input.docNumber,
    );
    if (!deletedMember || deletedMember.deletedAt === null) {
      if (existingUser && existingUser.deletedAt !== null) {
        deletedMember = await this.memberRepository.getByUserIdWithDeleted(
          existingUser.id,
        );
      } else {
        deletedMember = null;
      }
    }

    const { membershipPlanId, payment, email, ...memberData } = input;

    const membershipPlan =
      await this.membershipPlanRepository.findOne(membershipPlanId);
    if (!membershipPlan) {
      throw new NotFoundError(
        `Plan de membresía con ID ${membershipPlanId} no encontrado`,
      );
    }

    // Si encontramos un socio eliminado, lo reactivamos
    if (deletedMember) {
      const { member, membership, createdPayment } = await prisma.$transaction(
        async (tx) => {
          await this.userRepository.update(
            deletedMember.userId,
            {
              email,
              passwordHash: null,
              accountStatus: 'PENDING_ACTIVATION',
              role: 'MEMBER',
              isActive: true,
              deletedAt: null,
              failedLoginAttempts: 0,
              lockedUntil: null,
            },
            tx,
          );

          const reactivatedMember = await this.memberRepository.update(
            deletedMember.id,
            {
              ...memberData,
              docType: input.docType,
              docNumber: input.docNumber,
              status: 'ACTIVE',
              deletedAt: null,
            },
            tx,
          );

          const startDate = new Date();
          const endDate = new Date(startDate);
          endDate.setDate(
            endDate.getDate() +
              (payment ? membershipPlan.durationDays : FREE_TRIAL_DAYS),
          );

          const existingMembership =
            await this.membershipRepository.getByMemberIdWithDeleted(
              deletedMember.id,
              tx,
            );

          let activeMembership;
          if (existingMembership) {
            activeMembership = await this.membershipRepository.update(
              existingMembership.id,
              {
                membershipPlanId,
                startDate,
                endDate,
                status: 'ACTIVE',
                deletedAt: null,
              },
              tx,
            );
          } else {
            activeMembership = await this.membershipRepository.create(
              {
                memberId: deletedMember.id,
                membershipPlanId,
                startDate,
                endDate,
                status: 'ACTIVE',
              },
              tx,
            );
          }

          const newPayment = payment
            ? await this.paymentRepository.create(
                {
                  membershipId: activeMembership.id,
                  amount: payment.amount,
                  method: payment.method,
                  paymentDate: payment.paymentDate,
                  periodStart: startDate,
                  periodEnd: endDate,
                },
                tx,
              )
            : null;

          return {
            member: reactivatedMember,
            membership: activeMembership,
            createdPayment: newPayment,
          };
        },
      );

      return {
        ...this.toResponse(member),
        membership: this.membershipService.toResponse(membership),
        payment: createdPayment
          ? PaymentResponseSchema.parse(createdPayment)
          : null,
      };
    }

    // Member + User + Membership se crean atómicamente dentro de la misma transacción.
    const { member, membership, createdPayment } = await prisma.$transaction(
      async (tx) => {
        const newUser = await this.userRepository.add(
          {
            email,
            passwordHash: null,
            accountStatus: 'PENDING_ACTIVATION',
            role: 'MEMBER',
            isActive: true,
          },
          tx,
        );

        const newMember = await this.memberRepository.add(
          {
            ...memberData,
            docType: input.docType,
            docNumber: input.docNumber,
            userId: newUser.id,
          },
          tx,
        );

        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(
          endDate.getDate() +
            (payment ? membershipPlan.durationDays : FREE_TRIAL_DAYS),
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

        return {
          member: newMember,
          membership: newMembership,
          createdPayment: newPayment,
        };
      },
    );

    return {
      ...this.toResponse(member),
      membership: this.membershipService.toResponse(membership),
      payment: createdPayment
        ? PaymentResponseSchema.parse(createdPayment)
        : null,
    };
  }

  async update(id: number, input: UpdateMemberInput): Promise<MemberResponse> {
    const member = await this.memberRepository.getOne(id);
    if (!member) {
      throw new NotFoundError(`Socio con ID ${id} no encontrado`);
    }

    const { membershipPlanId, payment, email, ...memberData } = input;

    if (email !== undefined && email !== member.user.email) {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser && existingUser.deletedAt === null && existingUser.id !== member.userId) {
        throw new ConflictError('El email ingresado ya existe');
      }
    }

    if (
      memberData.docNumber !== undefined &&
      (memberData.docNumber !== member.docNumber ||
        (memberData.docType !== undefined && memberData.docType !== member.docType))
    ) {
      const docTypeToCheck = memberData.docType ?? member.docType;
      const existingMemberDoc = await this.memberRepository.findByDoc(
        docTypeToCheck,
        memberData.docNumber,
      );
      if (existingMemberDoc && existingMemberDoc.id !== id) {
        throw new ConflictError(
          'Ya existe otro socio registrado con ese documento',
        );
      }
    }

    let membershipPlan: Awaited<
      ReturnType<typeof this.membershipPlanRepository.findOne>
    > = null;
    let membership: Awaited<
      ReturnType<typeof this.membershipRepository.getByMemberId>
    > = null;

    if (membershipPlanId !== undefined) {
      membershipPlan =
        await this.membershipPlanRepository.findOne(membershipPlanId);
      if (!membershipPlan) {
        throw new NotFoundError(
          `Plan de membresía con ID ${membershipPlanId} no encontrado`,
        );
      }

      membership = await this.membershipRepository.getByMemberId(id);
      if (!membership) {
        throw new NotFoundError(
          `Membresía para el socio con ID ${id} no encontrada`,
        );
      }
    }

    const updatedMember = await prisma.$transaction(async (tx) => {
      if (email !== undefined && email !== member.user.email) {
        await this.userRepository.update(member.userId, { email }, tx);
      }

      const updated = await this.memberRepository.update(id, memberData, tx);

      if (membershipPlanId !== undefined && membership && membershipPlan) {
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(
          endDate.getDate() +
            (payment ? membershipPlan.durationDays : FREE_TRIAL_DAYS),
        );

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
      await this.userRepository.delete(member.userId, tx);
    });
  }

  private toResponse(member: MemberWithUser): MemberResponse {
    const { user, ...memberFields } = member;
    return MemberResponseSchema.parse({
      ...memberFields,
      email: user.email,
    });
  }
}
