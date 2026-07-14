import PlansMock from './plans.json' with { type: 'json' };
import { PlanProps, MembershipPlan } from './plan.entity.js';

export class PlanRepository {
  private plans: PlanProps[];

  constructor() {
    this.plans = PlansMock.map((plan) => ({
      ...plan,
    }));
  }

  async getAllPlans(): Promise<PlanProps[]> {
    return this.plans;
  }

  async getPlanById(id: number): Promise<PlanProps | null> {
    const plan = this.plans.find((p) => p.id === id);
    return plan || null;
  }

  async create(props: Omit<PlanProps, 'id'>): Promise<PlanProps> {
    const newId = Math.max(...this.plans.map((p) => p.id), 0) + 1;
    const newPlan: PlanProps = {
      id: newId,
      ...props,
    };
    this.plans.push(newPlan);
    return newPlan;
  }

  async save(
    id: number,
    props: Partial<PlanProps>,
  ): Promise<PlanProps | null> {
    const plan = this.plans.find((p) => p.id === id);
    if (!plan) return null;
    const updated = { ...plan, ...props };
    const index = this.plans.findIndex((p) => p.id === id);
    this.plans[index] = updated;
    return updated;
  }

  async delete(id: number): Promise<boolean> {
    const index = this.plans.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.plans.splice(index, 1);
    return true;
  }
}