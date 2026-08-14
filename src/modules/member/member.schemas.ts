 import { z } from 'zod';
import { Membership, Status } from '../../generated/prisma/client';

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
  joinDate: z.date(),
  //membershipPlan: z.ZodType<Membership>(),
  status: z.enum(Status),
});

export const UpdateMemberSchema = CreateMemberSchema.partial();

export const MemberResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  joinDate: z.date(),
  status: z.enum(Status),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export type CreateMemberInput = z.infer<typeof CreateMemberSchema>;
export type UpdateMemberInput = z.infer<typeof UpdateMemberSchema>;
export type MemberResponse = z.infer<typeof MemberResponseSchema>;