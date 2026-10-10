import { z } from 'zod';

// 1. Schema común para query params (?page=1&limit=10)
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

// 2. Interfaz estándar de respuesta paginada
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 3. Helper para calcular take y skip para Prisma
export function getPaginationParams(page = 1, limit = 10) {
  const take = Math.max(1, limit);
  const skip = Math.max(0, (Math.max(1, page) - 1) * take);
  return { take, skip, page, limit };
}
