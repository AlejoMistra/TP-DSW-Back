import { PlanRepository } from "./plan.repository.js";
import { PlanProps } from "./plan.entity.js";
import {
  CreatePlanInput,
  UpdatePlanInput,
} from "./plan.schemas.js";

export class PlanService {
  constructor(private planRepository: PlanRepository) {}

  async getAllPlans(): Promise<PlanProps[]> {
    return await this.planRepository.getAllPlans();
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
    return await this.planRepository.delete(id);
  }
}