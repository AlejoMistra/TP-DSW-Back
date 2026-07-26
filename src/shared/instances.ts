import { InstructorRepository } from '../modules/instructor/instructor.repository.js';
import { MemberRepository } from '../modules/member/member.repository.js';
import { ExerciseRepository } from '../modules/exercise/exercise.repository.js';
import { MembershipPlanRepository } from '../modules/membershipPlan/membershipPlan.repository.js';
import { ClassScheduleRepository } from '../modules/classSchedule/classSchedule.repository.js';

export const instructorRepository = new InstructorRepository();
export const memberRepository = new MemberRepository();
export const exerciseRepository = new ExerciseRepository();
export const membershipPlanRepository = new MembershipPlanRepository();
export const classScheduleRepository = new ClassScheduleRepository();