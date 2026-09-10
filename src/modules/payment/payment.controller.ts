import type { Request, Response } from 'express';
import { paymentService } from '../../shared/instances.js';
import type {
  CreatePaymentInput,
  UpdatePaymentInput,
} from './payment.schemas.js';

export const findAll = async (req: Request, res: Response) => {
  const membershipIdParam = req.params.membershipId ? Number(req.params.membershipId) : undefined;
  const membershipIdQuery = req.query.membershipId ? Number(req.query.membershipId) : undefined;
  const membershipId = membershipIdParam ?? membershipIdQuery;

  const payments = await paymentService.findAll(membershipId);
  res.status(200).json(payments);
};

export const findOne = async (req: Request, res: Response) => {
  const { id } = req.params;
  const payment = await paymentService.findOne(Number(id));
  res.status(200).json(payment);
};

export const create = async (req: Request, res: Response) => {
  const validated = req.validated as { body: CreatePaymentInput; params?: { membershipId?: number } };
  const membershipId = validated.params?.membershipId ?? validated.body.membershipId;

  const paymentData: CreatePaymentInput = {
    ...validated.body,
    membershipId,
  };

  const newPayment = await paymentService.create(paymentData);
  res.status(201).json(newPayment);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validated = req.validated as { body: UpdatePaymentInput };
  const updatedPayment = await paymentService.update(Number(id), validated.body);
  res.status(200).json(updatedPayment);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await paymentService.remove(Number(id));
  res.status(204).send();
};
