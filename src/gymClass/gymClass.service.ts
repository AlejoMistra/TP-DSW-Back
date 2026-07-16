import { GymClassRepository } from '../gymClass/gymClass.repository.js';
import { GymClassProps, GymClassCategory } from './gymClass.entity.js';
import {
  CreateGymClassInput,
  UpdateGymClassInput,
} from './gymClass.schemas.js';

export class GymClassService {
  constructor(private gymClassRepository: GymClassRepository) {}
  async getAll() {
    return await this.gymClassRepository.getAllGymClasses();
  }

  async getById(id: number): Promise<GymClassProps> {
    const classById = await this.gymClassRepository.getGymClassById(id);
    if (!classById) {
      throw new Error('Clase no encontrada');
    }
    return classById;
  }

  async getByInstructor(instructorId: number): Promise<GymClassProps[]> {
    const classesByInstructor =
      await this.gymClassRepository.getGymClassesByInstructorId(instructorId);
    if (!classesByInstructor) {
      throw new Error('Instructor sin clases asignadas');
    }
    return classesByInstructor;
  }

  async getByCategory(category: GymClassCategory): Promise<GymClassProps[]> {
    const gymClassesByCategory =
      await this.gymClassRepository.getGymClassesByCategory(category);
    if (!gymClassesByCategory) {
      throw new Error('No hay clases disponibles para esta categoria');
    }
    return gymClassesByCategory;
  }

  async create(props: CreateGymClassInput): Promise<GymClassProps> {
    const newClass = await this.gymClassRepository.create(props);
    return newClass;
  }

  async update(
    id: number,
    props: UpdateGymClassInput,
  ): Promise<GymClassProps | null> {
    const updatedClass = await this.gymClassRepository.save(id, props);
    return updatedClass;
  }

  async delete(id: number): Promise<boolean> {
    return await this.gymClassRepository.delete(id);
  }
}
