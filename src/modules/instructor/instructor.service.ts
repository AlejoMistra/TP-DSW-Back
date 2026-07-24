import { InstructorRepository } from './instructor.repository.js';
import { InstructorProps } from './instructor.entity.js';
import {
  CreateInstructorInput,
  UpdateInstructorInput,
} from './instructor.schemas.js';

export class InstructorService {
  constructor(private instructorRepository: InstructorRepository) {}

  async getAllInstructors() {
    return await this.instructorRepository.getAllInstructors();
  }

  async getInstructorById(id: number): Promise<InstructorProps> {
    const instructor = await this.instructorRepository.getInstructorById(id);
    if (!instructor) {
      throw new Error('Instructor no encontrado');
    }
    return instructor;
  }

  async createInstructor(
    props: CreateInstructorInput,
  ): Promise<InstructorProps> {
    const newInstructor = await this.instructorRepository.create({
      ...props,
    });
    return newInstructor;
  }

  async updateInstructor(
    id: number,
    props: UpdateInstructorInput,
  ): Promise<InstructorProps> {
    const updatedInstructor = await this.instructorRepository.save(id, props);
    if (!updatedInstructor) {
      throw new Error('Instructor no encontrado');
    }
    return updatedInstructor;
  }

  async deleteInstructor(id: number): Promise<boolean> {
    return await this.instructorRepository.delete(id);
  }
}
