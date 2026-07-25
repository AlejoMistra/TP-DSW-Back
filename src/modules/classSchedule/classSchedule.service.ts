import { ClassScheduleRepository } from '../classSchedule/classSchedule.repository.js';
import { InstructorRepository } from '../../modules/instructor/instructor.repository.js';
import {
  ClassScheduleProps,
  GymClassCategory,
  DayOfWeek,
} from './classSchedule.entity.js';
import {
  CreateClassScheduleInput,
  UpdateClassScheduleInput,
} from './classSchedule.schemas.js';

export class ClassScheduleService {
  constructor(
    private classScheduleRepository: ClassScheduleRepository,
    private instructorRepository: InstructorRepository,
  ) {}
  async getAll() {
    return await this.classScheduleRepository.getAllClassSchedules();
  }

  async getById(id: number): Promise<ClassScheduleProps> {
    const classById =
      await this.classScheduleRepository.getClassScheduleById(id);
    if (!classById) {
      throw new Error('Clase no encontrada');
    }
    return classById;
  }

  async getByInstructor(instructorId: number): Promise<ClassScheduleProps[]> {
    const instructor =
      await this.instructorRepository.getInstructorById(instructorId);
    if (!instructor) {
      throw new Error('Instructor no encontrado');
    }
    return await this.classScheduleRepository.getClassSchedulesByInstructorId(
      instructorId,
    );
  }

  async getByCategory(
    category: GymClassCategory,
  ): Promise<ClassScheduleProps[]> {
    return await this.classScheduleRepository.getClassSchedulesByCategory(
      category,
    );
  }

  async getByDayOfWeek(dayOfWeek: DayOfWeek): Promise<ClassScheduleProps[]> {
    return await this.classScheduleRepository.getClassSchedulesByDayOfWeek(
      dayOfWeek,
    );
  }

  async create(props: CreateClassScheduleInput): Promise<ClassScheduleProps> {
    const instructor = await this.instructorRepository.getInstructorById(
      props.instructorId,
    );
    if (!instructor) {
      throw new Error('Instructor no encontrado');
    }
    const newClass = await this.classScheduleRepository.create(props);
    return newClass;
  }

  async update(
    id: number,
    props: UpdateClassScheduleInput,
  ): Promise<ClassScheduleProps> {
    if (props.instructorId) {
      const instructor = await this.instructorRepository.getInstructorById(
        props.instructorId,
      );
      if (!instructor) {
        throw new Error('Instructor no encontrado');
      }
    }
    const updatedClass = await this.classScheduleRepository.save(id, props);
    if (!updatedClass) {
      throw new Error('Clase no encontrada');
    }
    return updatedClass;
  }

  async delete(id: number): Promise<boolean> {
    return await this.classScheduleRepository.delete(id);
  }
}
