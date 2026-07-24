import { Repository } from '../shared/base.repository.js';
import PlansMock from './plans.json' with { type: 'json' };
import { PlanProps, MembershipPlan } from './plan.entity.js';

export class PlanRepository implements Repository<PlanProps> {
  private plans: PlanProps[];

  constructor() {
    this.plans = PlansMock.map((plan) => ({
      ...plan,
    }));
  }

  async getAll(): Promise<PlanProps[]> {
    return Promise.resolve(this.plans);
  }

  async getOne(id: number): Promise<PlanProps | undefined> {
    const plan = this.plans.find((p) => p.id === id);
    return Promise.resolve(plan);
  }

  async add(item: Omit<PlanProps, 'id'>): Promise<PlanProps> {
    const newId = Math.max(...this.plans.map((p) => p.id), 0) + 1;
    const newPlan: PlanProps = {
      id: newId,
      ...item,
    };
    this.plans.push(newPlan);
    return Promise.resolve(newPlan);
  }

  async update(
    id: number,
    item: Partial<PlanProps>,
  ): Promise<PlanProps | undefined> {
    const plan = this.plans.find((p) => p.id === id);
    if (!plan) return Promise.resolve(undefined);

    const updated = { ...plan, ...item };
    const index = this.plans.findIndex((p) => p.id === id);
    this.plans[index] = updated;
    return Promise.resolve(updated);
  }

  async delete(id: number): Promise<boolean> {
    const index = this.plans.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.plans.splice(index, 1);
    return true;
  }
}
