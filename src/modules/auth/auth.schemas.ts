import { z } from 'zod';

export const LoginSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
  }),
});

export const ActivateAccountSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
    name: z.string().min(1, 'El nombre es requerido'),
    surname: z.string().min(1, 'El apellido es requerido'),
    docNumber: z.string().min(1, 'El documento es requerido'),
    newPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  }),
});

export type LoginInput = z.infer<typeof LoginSchema>['body'];
export type ActivateAccountInput = z.infer<typeof ActivateAccountSchema>['body'];

