import {
  ClassSessionResponseSchema,
  type ClassSessionResponse,
  type CreateClassSessionInput,
  type UpdateClassSessionInput,
} from './classSession.schemas.js';
import { ClassSessionRepository } from './classSession.repository.js';
import { ClassSession, ClassSchedule } from '../../generated/prisma/client.js';
import { ClassScheduleRepository } from '../classSchedule/classSchedule.repository.js';
import { InstructorRepository } from '../instructor/instructor.repository.js';
import { calculateEndTime, doIntervalsOverlap } from '../../utils/timeUtils.js';
import { NotFoundError, ConflictError} from '../../utils/errors.js';

export class ClassSessionService {
  constructor(
    private readonly repository: ClassSessionRepository,
    private readonly classScheduleRepository: ClassScheduleRepository,
    private readonly instructorRepository: InstructorRepository,
  ) {}

  async getAll(): Promise<ClassSessionResponse[]> {
    const sessions = await this.repository.getAll();
    return sessions.map((s) => this.toResponse(s));
  }

  async getById(id: number): Promise<ClassSessionResponse> {
    const session = await this.repository.getById(id);
    if (!session) throw new NotFoundError(`Sesión de clase con ID ${id} no encontrada`);
    return this.toResponse(session);
  }

  async getByInstructor(instructorId: number): Promise<ClassSessionResponse[]> {
    const sessions = await this.repository.getByInstructor(instructorId);
    return sessions.map((s) => this.toResponse(s));
  }

  async getBySchedule(classScheduleId: number): Promise<ClassSessionResponse[]> {
    const sessions = await this.repository.getBySchedule(classScheduleId);
    return sessions.map((s) => this.toResponse(s));
  }

  private async checkInstructorOverlap(instructorId: number, date: Date, startTime: string, durationMinutes: number, excludeSessionId?: number) {
    const activeSessions = await this.repository.findActiveSessionsByInstructorAndDate(instructorId, date);
    
    for (const session of activeSessions) {
      if (excludeSessionId && session.id === excludeSessionId) continue;
      
      const overlap = doIntervalsOverlap(
        startTime,
        durationMinutes,
        session.startTime,
        session.classSchedule.durationMinutes
      );
      
      if (overlap) {
        throw new ConflictError(`El instructor ya tiene una clase asignada que se solapa a las ${session.startTime}`);
      }
    }
  }

  async create(input: CreateClassSessionInput): Promise<ClassSessionResponse> {
    const schedule = await this.classScheduleRepository.getById(input.classScheduleId);
    if (!schedule) throw new NotFoundError(`Tipo de clase con ID ${input.classScheduleId} no encontrado`);

    if (input.instructorId) {
      const instructor = await this.instructorRepository.getById(input.instructorId);
      if (!instructor) throw new NotFoundError(`Instructor con ID ${input.instructorId} no encontrado`);
      
      await this.checkInstructorOverlap(input.instructorId, input.date, input.startTime, schedule.durationMinutes);
    }

    const session = await this.repository.create(input, schedule.maxCapacity);
    return this.toResponse(session);
  }

  async update(id: number, input: UpdateClassSessionInput): Promise<ClassSessionResponse> {
    const existing = await this.repository.getById(id);
    if (!existing) throw new NotFoundError(`Sesión de clase con ID ${id} no encontrada`);

    const scheduleId = input.classScheduleId ?? existing.classScheduleId;
    const schedule = await this.classScheduleRepository.getById(scheduleId);
    if (!schedule) throw new NotFoundError(`Tipo de clase con ID ${scheduleId} no encontrado`);

    const instructorId = input.instructorId !== undefined ? input.instructorId : existing.instructorId;
    
    if (instructorId) {
      const instructor = await this.instructorRepository.getById(instructorId);
      if (!instructor) throw new NotFoundError(`Instructor con ID ${instructorId} no encontrado`);
      
      const dateToCheck = input.date ?? existing.date;
      const startTimeToCheck = input.startTime ?? existing.startTime;
      
      await this.checkInstructorOverlap(instructorId, dateToCheck, startTimeToCheck, schedule.durationMinutes, id);
    }

    const updated = await this.repository.update(id, input);
    return this.toResponse(updated);
  }
  
  async delete(id: number): Promise<void> {
    const existing = await this.repository.getById(id);
    if (!existing) throw new NotFoundError(`Sesión de clase con ID ${id} no encontrada`);
    await this.repository.delete(id);
  }

  private toResponse(session: ClassSession & { classSchedule: ClassSchedule }): ClassSessionResponse {
    const endTime = calculateEndTime(session.startTime, session.classSchedule.durationMinutes);
    return ClassSessionResponseSchema.parse({
      id: session.id,
      classScheduleId: session.classScheduleId,
      instructorId: session.instructorId,
      date: session.date,
      startTime: session.startTime,
      endTime,
      remainingCapacity: session.remainingCapacity,
      status: session.status,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      deletedAt: session.deletedAt,
    });
  }
}