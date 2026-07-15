import GymClassesMock from './gymClasses.json' with { type: 'json' };
import { GymClassProps, GymClassCategory } from './gymClass.entity.js';

export class GymClassRepository {
  private gymClasses: GymClassProps[];

  constructor() {
    this.gymClasses = GymClassesMock.map((gymClass) => ({
      ...gymClass,
      category: gymClass.category as GymClassCategory,
    }));
  }

  async getAllGymClasses(): Promise<GymClassProps[]> {
    return Promise.resolve(this.gymClasses);
  }

  async getGymClassById(id: number): Promise<GymClassProps | null> {
    const gymClass = this.gymClasses.find((g) => g.id === id);
    return Promise.resolve(gymClass || null);
  }

  async getGymClassesByInstructorId(
    instructorId: number,
  ): Promise<GymClassProps[] | null> {
    const gymClasses = this.gymClasses.filter(
      (g) => g.instructorId === instructorId,
    );
    return Promise.resolve(gymClasses || null);
  }

  async create(props: Omit<GymClassProps, 'id'>): Promise<GymClassProps> {
    const newId = Math.max(...this.gymClasses.map((g) => g.id), 0) + 1;
    const newGymClass: GymClassProps = {
      id: newId,
      ...props,
    };
    this.gymClasses.push(newGymClass);
    return Promise.resolve(newGymClass);
  }

  async save(
    id: number,
    props: Partial<GymClassProps>,
  ): Promise<GymClassProps | null> {
    const gymClass = this.gymClasses.find((c) => c.id === id);
    if (!gymClass) {
      return Promise.resolve(null);
    }

    const updated = { ...gymClass, ...props };
    const index = this.gymClasses.findIndex((c) => c.id === id);
    this.gymClasses[index] = updated;
    return Promise.resolve(updated);
  }

  async delete(id: number): Promise<boolean> {
    const index = this.gymClasses.findIndex((c) => c.id === id);
    if (index === -1) return Promise.resolve(false);
    this.gymClasses.splice(index, 1);
    return Promise.resolve(true);
  }
}
