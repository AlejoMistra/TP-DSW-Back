import { InstructorRepository } from '../modules/instructor/instructor.repository.js';
import { ExerciseRepository } from '../modules/exercise/exercise.repository.js';
import { ClassScheduleRepository } from '../modules/classSchedule/classSchedule.repository.js';
import { ClassScheduleService } from '../modules/classSchedule/classSchedule.service.js';
import { ClassScheduleController } from '../modules/classSchedule/classSchedule.controller.js';
import { ClassSessionRepository } from '../modules/classSession/classSession.repository.js';
import { ClassSessionService } from '../modules/classSession/classSession.service.js';
import { ClassSessionController } from '../modules/classSession/classSession.controller.js';
import { ClassBookingRepository } from '../modules/classBooking/classBooking.repository.js';
import { RoutineExerciseRepository } from '../modules/routineExercise/routineExercise.repository.js';
import { RoutineRepository } from '../modules/routine/routine.repository.js';
import { ClassBookingService } from '../modules/classBooking/classBooking.service.js';
import { ClassBookingController } from '../modules/classBooking/classBooking.controller.js';
import { MembershipPlanRepository } from '../modules/membershipPlan/membershipPlan.repository.js';
import { MembershipRepository } from '../modules/membership/membership.repository.js';
import { MembershipService } from '../modules/membership/membership.service.js';
import { PaymentRepository } from '../modules/payment/payment.repository.js';
import { PaymentService } from '../modules/payment/payment.service.js';
import { MemberRepository } from '../modules/member/member.repository.js';
import { MemberService } from '../modules/member/member.service.js';

// 1. Instructors & Exercises
export const instructorRepository = new InstructorRepository();
export const exerciseRepository = new ExerciseRepository();

// 2. Class Management Domain
// Class Schedule
export const classScheduleRepository = new ClassScheduleRepository();
export const classScheduleService = new ClassScheduleService(
  classScheduleRepository,
);
export const classScheduleController = new ClassScheduleController(
  classScheduleService,
);

// Class Session
export const classSessionRepository = new ClassSessionRepository();
export const classSessionService = new ClassSessionService(
  classSessionRepository,
  classScheduleRepository,
  instructorRepository,
);
export const classSessionController = new ClassSessionController(
  classSessionService,
);

// Class Booking
export const classBookingRepository = new ClassBookingRepository();
export const routineExerciseRepository = new RoutineExerciseRepository();
export const routineRepository = new RoutineRepository();
export const classBookingService = new ClassBookingService(
  classBookingRepository,
);
export const classBookingController = new ClassBookingController(
  classBookingService,
);

// 3. Membership & Payments Domain
// Membership Plan
export const membershipPlanRepository = new MembershipPlanRepository();

// Membership
export const membershipRepository = new MembershipRepository();
export const membershipService = new MembershipService(
  membershipRepository,
  membershipPlanRepository,
);

// Payment
export const paymentRepository = new PaymentRepository();
export const paymentService = new PaymentService(
  paymentRepository,
  membershipRepository,
);

// 4. Members Domain
export const memberRepository = new MemberRepository();
export const memberService = new MemberService(
  memberRepository,
  membershipRepository,
  membershipService,
  membershipPlanRepository,
  paymentRepository,
);
