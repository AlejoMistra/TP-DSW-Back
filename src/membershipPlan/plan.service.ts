import { PlanRepository } from "./plan.repository.js";
import { PlanProps } from "./plan.entity.js";
import {
  CreatePlanInput,
  UpdatePlanInput,
} from "./plan.schemas.js";

// FIXME: La capa service mezcla estilos de error: getPlanById lanza excepción cuando no existe, pero updatePlan devuelve null. Para un API consistente (y más fácil de manejar en el router), considera devolver null también en getPlanById o lanzar un error tipado (p. ej. NotFoundError) para que el router pueda mapearlo a HTTP 404 sin ambigüedad.

export class PlanService {
  constructor(private planRepository: PlanRepository) {}

  async getAllPlans(): Promise<PlanProps[]> {
    return this.planRepository.getAllPlans();
  }

  async getPlanById(id: number): Promise<PlanProps> {
    const plan = await this.planRepository.getPlanById(id);
    if (!plan) {
      throw new Error("Plan no encontrado");
    }
    return plan;
  }

  async createPlan(props: CreatePlanInput): Promise<PlanProps> {
    const newPlan = await this.planRepository.create({
      ...props,
    });
    return newPlan;
  }

  async updatePlan(
    id: number,
    props: UpdatePlanInput
  ): Promise<PlanProps | null> {
    const updatedPlan = await this.planRepository.save(id, props);
    return updatedPlan;
  }

  async deletePlan(id: number): Promise<boolean> {
    return this.planRepository.delete(id);
  }
}