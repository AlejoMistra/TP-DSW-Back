import type {
  CreatePaymentInput,
  UpdatePaymentInput,
} from './payment.schemas.js';
import { prisma } from '../../lib/prisma.js';
import type { Payment, Prisma } from '../../generated/prisma/client.js';

type DbClient = Prisma.TransactionClient | typeof prisma;

import { getPaginationParams } from '../../shared/pagination.js';

export class PaymentRepository {
  async findAll(membershipId?: number, page?: number, limit?: number): Promise<Payment[]> {
    const { take, skip } = getPaginationParams(page, limit);
    return prisma.payment.findMany({
      where: {
        deletedAt: null,
        membershipId: membershipId ?? undefined,
      },
      take,
      skip,
      orderBy: {
        periodEnd: 'desc',
      },
    });
  }

  async count(membershipId?: number): Promise<number> {
    return prisma.payment.count({
      where: {
        deletedAt: null,
        membershipId: membershipId ?? undefined,
      },
    });
  }

  async findById(id: number): Promise<Payment | null> {
    return prisma.payment.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findLatestByMembershipId(membershipId: number): Promise<Payment | null> {
    return prisma.payment.findFirst({
      where: {
        membershipId,
        deletedAt: null,
      },
      orderBy: {
        periodEnd: 'desc',
      },
    });
  }

  async create(payment: CreatePaymentInput, db: DbClient = prisma): Promise<Payment> {
    return db.payment.create({
      data: {
        membership: { connect: { id: payment.membershipId } },
        amount: payment.amount,
        method: payment.method,
        paymentDate: payment.paymentDate ? new Date(payment.paymentDate) : new Date(),
        periodStart: new Date(payment.periodStart),
        periodEnd: new Date(payment.periodEnd),
      },
    });
  }

  async update(id: number, payment: UpdatePaymentInput): Promise<Payment> {
    return prisma.payment.update({
      where: { id },
      data: {
        membershipId: payment.membershipId ?? undefined,
        amount: payment.amount ?? undefined,
        method: payment.method ?? undefined,
        paymentDate: payment.paymentDate ? new Date(payment.paymentDate) : undefined,
        periodStart: payment.periodStart ? new Date(payment.periodStart) : undefined,
        periodEnd: payment.periodEnd ? new Date(payment.periodEnd) : undefined,
      },
    });
  }

  async delete(id: number): Promise<Payment> {
    return prisma.payment.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
