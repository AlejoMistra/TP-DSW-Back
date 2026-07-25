import { InstructorRepository } from './instructor.repository.js';
import { InstructorProps } from './instructor.entity.js';
import {
  CreateInstructorInput,
  UpdateInstructorInput,
} from './instructor.schemas.js';

export class InstructorService {
  constructor(private instructorRepository: InstructorRepository) {}

  async getAllInstructors(): Promise<InstructorProps[]> {
    return await this.instructorRepository.getAll();
  }

  async getInstructorById(id: number): Promise<InstructorProps> {
    const instructor = await this.instructorRepository.getOne(id);
    if (!instructor) {
      throw new Error('Instructor no encontrado');
    }
    return instructor;
  }

  async add(props: CreateInstructorInput): Promise<InstructorProps> {
    const newInstructor = await this.instructorRepository.add({
      ...props,
    });
    return newInstructor;
  }

  async updateInstructor(
    id: number,
    props: UpdateInstructorInput,
  ): Promise<InstructorProps> {
    const updatedInstructor = await this.instructorRepository.update(id, props);
    if (!updatedInstructor) {
      throw new Error('Instructor no encontrado');
    }
    return updatedInstructor;
  }

  async deleteInstructor(id: number): Promise<boolean> {
    return await this.instructorRepository.delete(id);
  }
}
