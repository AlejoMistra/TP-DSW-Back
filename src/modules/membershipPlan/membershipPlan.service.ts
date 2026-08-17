import { CreatePlanInput, UpdatePlanInput } from './membershipPlan.schemas.js';
import type { MembershipPlanRepository } from './membershipPlan.repository.js';

// FIXME: La capa service mezcla estilos de error: getPlanById lanza excepción cuando no existe, pero updatePlan devuelve null. Para un API consistente (y más fácil de manejar en el router), considera devolver null también en getPlanById o lanzar un error tipado (p. ej. NotFoundError) para que el router pueda mapearlo a HTTP 404 sin ambigüedad.

export class MembershipPlanService {
  constructor(private readonly repository: MembershipPlanRepository) {}

  // TODO: Considerar si conviene que el service devuelva un DTO (Data Transfer Object) en lugar de la entidad directamente, para desacoplar la capa de persistencia de la capa de presentación.

  async getAllPlans() {
    return await this.repository.getAll();
  }

  async getPlanById(id: number) {
    return await this.repository.getOne(id);
  }

  async createPlan(plan: CreatePlanInput) {
    return await this.repository.add(plan);
  }

  async updatePlan(id: number, plan: UpdatePlanInput) {
    return await this.repository.update(id, plan);
  }

  async deletePlan(id: number) {
    return await this.repository.delete(id);
  }
}
