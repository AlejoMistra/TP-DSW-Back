 import { z } from 'zod';
import { Membership, Status } from '../../generated/prisma/client.js';

export const MemberIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID debe ser un número').transform(Number),
});

export const CreateMemberSchema = z.object({
  name: z
    .string()
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(100, 'Nombre máximo 100 caracteres'),
  surname: z
    .string()
    .min(2, 'Apellido debe tener al menos 2 caracteres')
    .max(100, 'Apellido máximo 100 caracteres'),
  email: z.email('Email inválido'),
  phone: z
    .string()
    .regex(/^\d{7,15}$/, 'Teléfono debe tener entre 7 y 15 dígitos')
    .nullable()
    .optional(),
  docType: z.enum(['DNI', 'PASAPORTE']).default('DNI'),
  docNumber: z
    .string()
    .min(8, 'Formato invalido de documento')
    .max(8, 'Formato invalido de documento'),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido de fecha (YYYY-MM-DD)'),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'), // Por defecto será ACTIVE
  membershipPlanId: z.number().int().positive('Plan es requerido'),
  lastPaymentMethod: z
    .enum(['CREDIT_CARD', 'DEBIT_CARD', 'TRANSFER', 'CASH', 'OTHER'])
    .optional(),
  lastPaymentDate: z.string().optional(),
  lastPaymentAmount: z.number().positive().optional(),
});

// Schema para actualizar (solo name, surname, email, phone)
export const UpdateMemberSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  surname: z.string().min(2).max(100).optional(),
  email: z.email().optional(),
  phone: z
    .string()
    .regex(/^\d{7,15}$/)
    .nullable()
    .optional(),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido de fecha (YYYY-MM-DD)')
    .optional(),
  membershipPlanId: z.number().int().positive().optional(),

  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const MemberResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  docType: z.enum(['DNI', 'PASAPORTE']),
  docNumber: z.string(),
  birthDate: z.date(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export type CreateMemberInput = z.infer<typeof CreateMemberSchema>;
export type UpdateMemberInput = z.infer<typeof UpdateMemberSchema>;
export type MemberResponse = z.infer<typeof MemberResponseSchema>;
