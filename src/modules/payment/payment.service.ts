import type {
  CreatePaymentInput,
  UpdatePaymentInput,
  PaymentResponse,
} from './payment.schemas.js';
import { PaymentResponseSchema } from './payment.schemas.js';
import type { PaymentRepository } from './payment.repository.js';
import type { Payment } from '../../generated/prisma/client.js';
import { NotFoundError } from '../../utils/errors.js';
import type { MembershipRepository } from '../membership/membership.repository.js';

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

    // Actualizar endDate y status de la membresía con el período del pago reciente.
    await this.membershipRepository.updateEndDate(
      newPayment.membershipId,
      newPayment.periodEnd,
      'ACTIVE',
    );

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

    // Re-sincronizar si cambió el período o se reasignó a otra membresía.
    const periodEndChanged = input.periodEnd !== undefined;
    const membershipChanged =
      input.membershipId !== undefined &&
      input.membershipId !== existingPayment.membershipId;

    if (periodEndChanged || membershipChanged) {
      await this.membershipRepository.updateEndDate(
        updatedPayment.membershipId,
        updatedPayment.periodEnd,
        'ACTIVE',
      );
    }

    return this.toResponse(updatedPayment);
  }

  async remove(id: number): Promise<void> {
    const existingPayment = await this.repository.findById(id);
    if (!existingPayment) {
      throw new NotFoundError(`Pago con ID ${id} no encontrado`);
    }

    await this.repository.delete(id);
  }

  private toResponse(payment: Payment): PaymentResponse {
    return PaymentResponseSchema.parse(payment);
  }
}
