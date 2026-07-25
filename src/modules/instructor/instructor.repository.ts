import { Repository } from '../../shared/base.repository.js';
import InstructoresMock from './instructores.json' with { type: 'json' }; //por ahora es un json con socios, depues una bd
import { InstructorProps } from './instructor.entity.js';

export class InstructorRepository implements Repository<InstructorProps> {
  private instructors: InstructorProps[];

  constructor() {
    this.instructors = InstructoresMock.map((instructor) => ({
      ...instructor,
    }));
  }

  async getAll(): Promise<InstructorProps[]> {
    return Promise.resolve(this.instructors);
  }

  async getOne(id: number): Promise<InstructorProps | undefined> {
    const instructor = this.instructors.find((i) => i.id === id);
    return Promise.resolve(instructor || undefined);
  }

  async add(item: Omit<InstructorProps, 'id'>): Promise<InstructorProps> {
    const newId = Math.max(...this.instructors.map((i) => i.id), 0) + 1;
    const newInstructor: InstructorProps = {
      id: newId,
      ...item,
    };
    this.instructors.push(newInstructor);
    return Promise.resolve(newInstructor);
  }

  async update(
    id: number,
    item: Partial<Omit<InstructorProps, 'id'>>,
  ): Promise<InstructorProps | undefined> {
    const instructor = this.instructors.find((i) => i.id === id);
    if (!instructor) return Promise.resolve(undefined);

    const updated = { ...instructor, ...item };
    const index = this.instructors.findIndex((i) => i.id === id);
    this.instructors[index] = updated;
    return Promise.resolve(updated);
  }

  async delete(id: number): Promise<boolean> {
    const index = this.instructors.findIndex((i) => i.id === id);
    if (index === -1) return Promise.resolve(false);

    this.instructors.splice(index, 1);
    return Promise.resolve(true);
  }
}
