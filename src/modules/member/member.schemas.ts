import { z } from 'zod';

// Schema para obtener un socio por ID (parámetro de ruta)
export const MemberIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID debe ser un número').transform(Number),
});

// Schema para crear un socio (POST - sin ID ni fechaIngreso)
export const CreateMemberSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').max(100),
  surname: z
    .string()
    .min(2, 'Apellido debe tener al menos 2 caracteres')
    .max(100),
  email: z.string().email('Email inválido'),
  phoneNumber: z
    .string()
    .regex(/^\d{7,15}$/, 'Teléfono debe tener entre 7 y 15 dígitos'),
  status: z.enum(['active', 'inactive']).default('active'),
});

// Schema para actualizar un socio (PUT/PATCH - todos campos opcionales)
export const UpdateMemberSchema = CreateMemberSchema.partial();

// Schema de respuesta (con ID y fechaIngreso)
export const MemberResponseSchema = CreateMemberSchema.extend({
  id: z.number(),
  joinDate: z.date(),
});

// Tipos inferidos automáticamente de TypeScript
export type CreateMemberInput = z.infer<typeof CreateMemberSchema>;
export type UpdateMemberInput = z.infer<typeof UpdateMemberSchema>;
export type MemberResponse = z.infer<typeof MemberResponseSchema>;
