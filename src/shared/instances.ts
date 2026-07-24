import { InstructorRepository } from '../instructor/instructor.repository.js';
import { MemberRepository } from '../member/member.repository.js';
import { ExerciseRepository } from '../exercise/exercise.repository.js';
import { PlanRepository } from '../membershipPlan/plan.repository.js';
import { ClassScheduleRepository } from '../classSchedule/classSchedule.repository.js';

export const instructorRepository = new InstructorRepository();
export const memberRepository = new MemberRepository();
export const exerciseRepository = new ExerciseRepository();
export const planRepository = new PlanRepository();
export const classScheduleRepository = new ClassScheduleRepository();
