import { z } from 'zod';

// Schema para obtener un socio por ID (parámetro de ruta)
export const SocioIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID debe ser un número').transform(Number),
});

// Schema para crear un socio (POST - sin ID ni fechaIngreso)
export const CreateSocioSchema = z.object({
  nombre: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').max(100),
  apellido: z
    .string()
    .min(2, 'Apellido debe tener al menos 2 caracteres')
    .max(100),
  email: z.string().email('Email inválido'),
  telefono: z
    .string()
    .regex(/^\d{7,15}$/, 'Teléfono debe tener entre 7 y 15 dígitos'),
  estado: z.enum(['activo', 'inactivo']).default('activo'),
});

// Schema para actualizar un socio (PUT/PATCH - todos campos opcionales)
export const UpdateSocioSchema = CreateSocioSchema.partial();

// Schema de respuesta (con ID y fechaIngreso)
export const SocioResponseSchema = CreateSocioSchema.extend({
  id: z.number(),
  fechaIngreso: z.date(),
});

// Tipos inferidos automáticamente de TypeScript
export type CreateSocioInput = z.infer<typeof CreateSocioSchema>;
export type UpdateSocioInput = z.infer<typeof UpdateSocioSchema>;
export type SocioResponse = z.infer<typeof SocioResponseSchema>;
