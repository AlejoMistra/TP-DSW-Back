import InstructoresMock from './instructores.json' with { type: 'json' }; //por ahora es un json con socios, depues una bd
import { PropiedadesInstructor } from './instructor.entity.js';

export class InstructorRepository {
  private instructores: PropiedadesInstructor[];

  constructor() {
    //simula la carga de dados desde una BD a memoria
    this.instructores = InstructoresMock.map((instructor) => ({
      ...instructor,
    }));
  }

  async getAllInstructores(): Promise<PropiedadesInstructor[]> {
    return Promise.resolve(this.instructores);
  }

  async getSocioById(id: number): Promise<PropiedadesInstructor | null> {
    const instructor = this.instructores.find((i) => i.id === id);
    return Promise.resolve(instructor || null);
  }

  async create(
    propiedades: Omit<PropiedadesInstructor, 'id'>,
  ): Promise<PropiedadesInstructor> {
    const newId = Math.max(...this.instructores.map((i) => i.id), 0) + 1;
    const newInstructor: PropiedadesInstructor = {
      id: newId,
      ...propiedades,
    };
    this.instructores.push(newInstructor);
    return Promise.resolve(newInstructor);
  }

  async save(
    id: number,
    propiedades: Partial<PropiedadesInstructor>,
  ): Promise<PropiedadesInstructor | null> {
    const instructor = this.instructores.find((i) => i.id === id);
    if (!instructor) return Promise.resolve(null);

    const updated = { ...instructor, ...propiedades };
    const index = this.instructores.findIndex((i) => i.id === id);
    this.instructores[index] = updated;
    return Promise.resolve(updated);
  }

  async delete(id: number): Promise<boolean> {
    const index = this.instructores.findIndex((i) => i.id === id);
    if (index === -1) return Promise.resolve(false);

    this.instructores.splice(index, 1);
    return Promise.resolve(true);
  }
}
