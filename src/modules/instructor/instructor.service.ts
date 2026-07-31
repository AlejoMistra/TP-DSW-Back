import { Instructor } from '../../generated/prisma/client.js';
import { InstructorRepository } from './instructor.repository.js';
import {
  CreateInstructorInput,
  UpdateInstructorInput,
} from './instructor.schemas.js';

export class InstructorService {
  constructor(private instructorRepository: InstructorRepository) {}

  async getAll(): Promise<Instructor[]> {
    return await this.instructorRepository.getAll();
  }

  async getById(id: number): Promise<Instructor> {
    const instructor = await this.instructorRepository.getOne(id);
    if (!instructor) {
      throw new Error('Instructor no encontrado');
    }
    return instructor;
  }

  async add(props: CreateInstructorInput): Promise<Instructor> {
    const newInstructor = await this.instructorRepository.add({
      ...props,
    });
    return newInstructor;
  }

  async update(id: number, props: UpdateInstructorInput): Promise<Instructor> {
    const instructor = await this.instructorRepository.getOne(id);
    if (!instructor) {
      throw new Error('Instructor no encontrado');
    }
    const updatedInstructor = await this.instructorRepository.update(id, props);
    if (!updatedInstructor) {
      throw new Error('Error al actualizar el instructor');
    }
    return updatedInstructor;
  }

  async delete(id: number): Promise<void> {
    const instructor = await this.instructorRepository.getOne(id);
    if (!instructor) {
      throw new Error('Instructor no encontrado');
    }
    await this.instructorRepository.delete(id);
  }
}
