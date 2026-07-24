import InstructoresMock from './instructores.json' with { type: 'json' }; //por ahora es un json con socios, depues una bd
import { InstructorProps } from './instructor.entity.js';

export class InstructorRepository {
  private instructors: InstructorProps[];

  constructor() {
    this.instructors = InstructoresMock.map((instructor) => ({
      ...instructor,
    }));
  }

  async getAllInstructors(): Promise<InstructorProps[]> {
    return Promise.resolve(this.instructors);
  }

  async getInstructorById(id: number): Promise<InstructorProps | null> {
    const instructor = this.instructors.find((i) => i.id === id);
    return Promise.resolve(instructor || null);
  }

  async create(props: Omit<InstructorProps, 'id'>): Promise<InstructorProps> {
    const newId = Math.max(...this.instructors.map((i) => i.id), 0) + 1;
    const newInstructor: InstructorProps = {
      id: newId,
      ...props,
    };
    this.instructors.push(newInstructor);
    return Promise.resolve(newInstructor);
  }

  async save(
    id: number,
    props: Partial<InstructorProps>,
  ): Promise<InstructorProps | null> {
    const instructor = this.instructors.find((i) => i.id === id);
    if (!instructor) return Promise.resolve(null);
    const updated = { ...instructor, ...props };
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
