import { MemberRepository } from '../modules/member/member.repository.js';
import { InstructorRepository } from '../modules/instructor/instructor.repository.js';
import { MembershipPlanRepository } from '../modules/membershipPlan/membershipPlan.repository.js';
import { ClassScheduleRepository } from '../modules/classSchedule/classSchedule.repository.js';
import { MembershipRepository } from '../modules/membership/membership.repository.js';
import { ExerciseRepository } from '../modules/exercise/exercise.repository.js';
import { ClassSessionRepository } from '../modules/classSession/classSession.repository.js';
import { ClassBookingRepository } from '../modules/classBooking/classBooking.repository.js';

export const memberRepository = new MemberRepository();
export const instructorRepository = new InstructorRepository();
export const membershipRepository = new MembershipRepository();
export const membershipPlanRepository = new MembershipPlanRepository();
export const classScheduleRepository = new ClassScheduleRepository();
export const classSessionRepository = new ClassSessionRepository();
export const classBookingRepository = new ClassBookingRepository();
export const exerciseRepository = new ExerciseRepository();
