import ClassSchedulesMock from './classSchedules.json' with { type: 'json' };
import {
  ClassScheduleProps,
  GymClassCategory,
  DayOfWeek,
} from './classSchedule.entity.js';
import { Repository } from '../shared/base.repository';

export class ClassScheduleRepository implements Repository<ClassScheduleProps> {
  private classSchedules: ClassScheduleProps[];

  constructor() {
    this.classSchedules = ClassSchedulesMock.map((schedule) => ({
      ...schedule,
      category: schedule.category as GymClassCategory,
      dayOfWeek: schedule.dayOfWeek as DayOfWeek,
    }));
  }

  async getAll(): Promise<ClassScheduleProps[]> {
    return Promise.resolve(this.classSchedules);
  }

  async getOne(id: number): Promise<ClassScheduleProps | undefined> {
    const schedule = this.classSchedules.find((s) => s.id === id);
    return Promise.resolve(schedule);
  }

  async getClassSchedulesByInstructorId(
    instructorId: number,
  ): Promise<ClassScheduleProps[]> {
    const schedules = this.classSchedules.filter(
      (s) => s.instructorId === instructorId,
    );
    return Promise.resolve(schedules);
  }

  async getClassSchedulesByCategory(
    category: GymClassCategory,
  ): Promise<ClassScheduleProps[]> {
    const schedules = this.classSchedules.filter(
      (s) => s.category === category,
    );
    return Promise.resolve(schedules);
  }

  async getClassSchedulesByDayOfWeek(
    dayOfWeek: DayOfWeek,
  ): Promise<ClassScheduleProps[]> {
    const schedules = this.classSchedules.filter(
      (s) => s.dayOfWeek === dayOfWeek,
    );
    return Promise.resolve(schedules);
  }

  async add(item: Omit<ClassScheduleProps, 'id'>): Promise<ClassScheduleProps> {
    const newId = Math.max(...this.classSchedules.map((s) => s.id), 0) + 1;
    const newSchedule: ClassScheduleProps = {
      id: newId,
      ...item,
    };
    this.classSchedules.push(newSchedule);
    return Promise.resolve(newSchedule);
  }

  async update(
    id: number,
    item: Partial<Omit<ClassScheduleProps, 'id'>>,
  ): Promise<ClassScheduleProps | undefined> {
    const schedule = this.classSchedules.find((s) => s.id === id);
    if (!schedule) {
      return Promise.resolve(undefined);
    }

    const updated = { ...schedule, ...item };
    const index = this.classSchedules.findIndex((s) => s.id === id);
    this.classSchedules[index] = updated;
    return Promise.resolve(updated);
  }

  async delete(id: number): Promise<boolean> {
    const index = this.classSchedules.findIndex((s) => s.id === id);
    if (index === -1) return Promise.resolve(false);
    this.classSchedules.splice(index, 1);
    return Promise.resolve(true);
  }
}
