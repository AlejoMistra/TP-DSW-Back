import type {
  CreatePaymentInput,
  UpdatePaymentInput,
  PaymentResponse,
} from './payment.schemas.js';
import { PaymentResponseSchema } from './payment.schemas.js';
import type { PaymentRepository } from './payment.repository.js';
import type { MembershipRepository } from '../membership/membership.repository.js';
import type { Payment } from '../../generated/prisma/client.js';
import { NotFoundError } from '../../utils/errors.js';

export class PaymentService {
  constructor(
    private readonly repository: PaymentRepository,
    private readonly membershipRepository: MembershipRepository,
  ) {}

  async findAll(membershipId?: number): Promise<PaymentResponse[]> {
    if (membershipId) {
      const membership = await this.membershipRepository.getById(membershipId);
      if (!membership) {
        throw new NotFoundError(`Membresía con ID ${membershipId} no encontrada`);
      }
    }
    const payments = await this.repository.findAll(membershipId);
    return payments.map((p) => this.toResponse(p));
  }

  async findOne(id: number): Promise<PaymentResponse> {
    const payment = await this.repository.findById(id);
    if (!payment) {
      throw new NotFoundError(`Pago con ID ${id} no encontrado`);
    }
    return this.toResponse(payment);
  }

  async create(input: CreatePaymentInput): Promise<PaymentResponse> {
    const membership = await this.membershipRepository.getById(input.membershipId);
    if (!membership) {
      throw new NotFoundError(`Membresía con ID ${input.membershipId} no encontrada`);
    }

    const newPayment = await this.repository.create(input);
    await this.syncMembershipEndDate(input.membershipId);
    return this.toResponse(newPayment);
  }

  async update(id: number, input: UpdatePaymentInput): Promise<PaymentResponse> {
    const existingPayment = await this.repository.findById(id);
    if (!existingPayment) {
      throw new NotFoundError(`Pago con ID ${id} no encontrado`);
    }

    if (input.membershipId && input.membershipId !== existingPayment.membershipId) {
      const membership = await this.membershipRepository.getById(input.membershipId);
      if (!membership) {
        throw new NotFoundError(`Membresía con ID ${input.membershipId} no encontrada`);
      }
    }

    const updatedPayment = await this.repository.update(id, input);

    await this.syncMembershipEndDate(updatedPayment.membershipId);
    if (input.membershipId && input.membershipId !== existingPayment.membershipId) {
      await this.syncMembershipEndDate(existingPayment.membershipId);
    }

    return this.toResponse(updatedPayment);
  }

  async remove(id: number): Promise<void> {
    const existingPayment = await this.repository.findById(id);
    if (!existingPayment) {
      throw new NotFoundError(`Pago con ID ${id} no encontrado`);
    }

    await this.repository.delete(id);
    await this.syncMembershipEndDate(existingPayment.membershipId);
  }

  private async syncMembershipEndDate(membershipId: number): Promise<void> {
    const latestPayment = await this.repository.findLatestByMembershipId(membershipId);
    if (latestPayment) {
      await this.membershipRepository.updateEndDate(membershipId, latestPayment.periodEnd);
    }
  }

  private toResponse(payment: Payment): PaymentResponse {
    return PaymentResponseSchema.parse(payment);
  }
}
