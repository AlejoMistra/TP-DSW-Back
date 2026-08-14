import { z } from 'zod';
import { Decimal as PrismaDecimal, DecimalJsLike } from '@prisma/client/runtime/library';
import type { Prisma } from '../prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// DECIMAL
//------------------------------------------------------

export const DecimalJsLikeSchema: z.ZodType<Prisma.DecimalJsLike> = z.object({
  d: z.array(z.number()),
  e: z.number(),
  s: z.number(),
  toFixed: z.any(),
})

export const DECIMAL_STRING_REGEX = /^(?:-?Infinity|NaN|-?(?:0[bB][01]+(?:\.[01]+)?(?:[pP][-+]?\d+)?|0[oO][0-7]+(?:\.[0-7]+)?(?:[pP][-+]?\d+)?|0[xX][\da-fA-F]+(?:\.[\da-fA-F]+)?(?:[pP][-+]?\d+)?|(?:\d+|\d*\.\d+)(?:[eE][-+]?\d+)?))$/;

export const isValidDecimalInput =
  (v?: null | string | number | Prisma.DecimalJsLike): v is string | number | Prisma.DecimalJsLike => {
    if (v === undefined || v === null) return false;
    return (
      (typeof v === 'object' && 'd' in v && 'e' in v && 's' in v && 'toFixed' in v) ||
      (typeof v === 'string' && DECIMAL_STRING_REGEX.test(v)) ||
      typeof v === 'number'
    )
  };

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const MemberScalarFieldEnumSchema = z.enum(['id','name','surname','email','phone','joinDate','status','createdAt','updatedAt','deletedAt']);

export const InstructorScalarFieldEnumSchema = z.enum(['id','name','surname','email','phone','joinDate','createdAt','updatedAt','deletedAt']);

export const MembershipScalarFieldEnumSchema = z.enum(['id','startDate','endDate','status','lastPaymentMethod','lastPaymentDate','lastPaymentAmount','createdAt','updatedAt','deletedAt','memberId','membershipPlanId']);

export const MembershipPlanScalarFieldEnumSchema = z.enum(['id','name','description','price','durationDays','createdAt','updatedAt','deletedAt']);

export const ClassScheduleScalarFieldEnumSchema = z.enum(['id','name','description','category','maxCapacity','durationMinutes','instructorId','dayOfWeek','startTime','createdAt','updatedAt','deletedAt']);

export const ClassSessionScalarFieldEnumSchema = z.enum(['id','classScheduleId','date','startTime','endTime','remainingCapacity','status','createdAt','updatedAt','deletedAt']);

export const ClassBookingScalarFieldEnumSchema = z.enum(['id','memberId','classSessionId','bookingDate','status','createdAt','updatedAt','deletedAt']);

export const ExerciseScalarFieldEnumSchema = z.enum(['id','name','description','muscleGroup','difficultyLevel','createdAt','updatedAt','deletedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullsOrderSchema = z.enum(['first','last']);

export const MemberOrderByRelevanceFieldEnumSchema = z.enum(['name','surname','email','phone']);

export const InstructorOrderByRelevanceFieldEnumSchema = z.enum(['name','surname','email','phone']);

export const MembershipPlanOrderByRelevanceFieldEnumSchema = z.enum(['name','description']);

export const ClassScheduleOrderByRelevanceFieldEnumSchema = z.enum(['name','description','startTime']);

export const ExerciseOrderByRelevanceFieldEnumSchema = z.enum(['name','description','muscleGroup']);

export const ClassBookingStatusSchema = z.enum(['CONFIRMED','CANCELLED']);

export type ClassBookingStatusType = `${z.infer<typeof ClassBookingStatusSchema>}`

export const ClassCategorySchema = z.enum(['CARDIO','CROSSFIT','DANCE','FUNCTIONAL','HIIT','OTHER','PILATES','SPINNING','STRETCHING','YOGA']);

export type ClassCategoryType = `${z.infer<typeof ClassCategorySchema>}`

export const ClassStatusSchema = z.enum(['SCHEDULED','CANCELLED']);

export type ClassStatusType = `${z.infer<typeof ClassStatusSchema>}`

export const DayOfWeekSchema = z.enum(['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']);

export type DayOfWeekType = `${z.infer<typeof DayOfWeekSchema>}`

export const DifficultyLevelExerciseSchema = z.enum(['BEGINNER','INTERMEDIATE','ADVANCED']);

export type DifficultyLevelExerciseType = `${z.infer<typeof DifficultyLevelExerciseSchema>}`

export const MembershipStatusSchema = z.enum(['ACTIVE','EXPIRED','CANCELED']);

export type MembershipStatusType = `${z.infer<typeof MembershipStatusSchema>}`

export const PaymentMethodSchema = z.enum(['CREDIT_CARD','DEBIT_CARD','TRANSFER','CASH','OTHER']);

export type PaymentMethodType = `${z.infer<typeof PaymentMethodSchema>}`

export const StatusSchema = z.enum(['ACTIVE','INACTIVE']);

export type StatusType = `${z.infer<typeof StatusSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// MEMBER SCHEMA
/////////////////////////////////////////

export const MemberSchema = z.object({
  status: StatusSchema,
  id: z.number().int(),
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  joinDate: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
})

export type Member = z.infer<typeof MemberSchema>

/////////////////////////////////////////
// INSTRUCTOR SCHEMA
/////////////////////////////////////////

export const InstructorSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  joinDate: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
})

export type Instructor = z.infer<typeof InstructorSchema>

/////////////////////////////////////////
// MEMBERSHIP SCHEMA
/////////////////////////////////////////

export const MembershipSchema = z.object({
  status: MembershipStatusSchema,
  lastPaymentMethod: PaymentMethodSchema.nullable(),
  id: z.number().int(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  lastPaymentDate: z.coerce.date().nullable(),
  lastPaymentAmount: z.instanceof(PrismaDecimal, { message: "Field 'lastPaymentAmount' must be a Decimal. Location: ['Models', 'Membership']"}).nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
  memberId: z.number().int(),
  membershipPlanId: z.number().int(),
})

export type Membership = z.infer<typeof MembershipSchema>

/////////////////////////////////////////
// MEMBERSHIP PLAN SCHEMA
/////////////////////////////////////////

export const MembershipPlanSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  durationDays: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
})

export type MembershipPlan = z.infer<typeof MembershipPlanSchema>

/////////////////////////////////////////
// CLASS SCHEDULE SCHEMA
/////////////////////////////////////////

export const ClassScheduleSchema = z.object({
  category: ClassCategorySchema,
  dayOfWeek: DayOfWeekSchema,
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullable(),
  maxCapacity: z.number().int(),
  durationMinutes: z.number().int(),
  instructorId: z.number().int(),
  startTime: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
})

export type ClassSchedule = z.infer<typeof ClassScheduleSchema>

/////////////////////////////////////////
// CLASS SESSION SCHEMA
/////////////////////////////////////////

export const ClassSessionSchema = z.object({
  status: ClassStatusSchema,
  id: z.number().int(),
  classScheduleId: z.number().int(),
  date: z.coerce.date(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  remainingCapacity: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
})

export type ClassSession = z.infer<typeof ClassSessionSchema>

/////////////////////////////////////////
// CLASS BOOKING SCHEMA
/////////////////////////////////////////

export const ClassBookingSchema = z.object({
  status: ClassBookingStatusSchema,
  id: z.number().int(),
  memberId: z.number().int(),
  classSessionId: z.number().int(),
  bookingDate: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
})

export type ClassBooking = z.infer<typeof ClassBookingSchema>

/////////////////////////////////////////
// EXERCISE SCHEMA
/////////////////////////////////////////

export const ExerciseSchema = z.object({
  difficultyLevel: DifficultyLevelExerciseSchema,
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullable(),
  muscleGroup: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
})

export type Exercise = z.infer<typeof ExerciseSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// MEMBER
//------------------------------------------------------

export const MemberIncludeSchema: z.ZodType<Prisma.MemberInclude> = z.object({
  membership: z.union([z.boolean(),z.lazy(() => MembershipArgsSchema)]).optional(),
  classBookings: z.union([z.boolean(),z.lazy(() => ClassBookingFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MemberCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const MemberArgsSchema: z.ZodType<Prisma.MemberDefaultArgs> = z.object({
  select: z.lazy(() => MemberSelectSchema).optional(),
  include: z.lazy(() => MemberIncludeSchema).optional(),
}).strict();

export const MemberCountOutputTypeArgsSchema: z.ZodType<Prisma.MemberCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => MemberCountOutputTypeSelectSchema).nullish(),
}).strict();

export const MemberCountOutputTypeSelectSchema: z.ZodType<Prisma.MemberCountOutputTypeSelect> = z.object({
  classBookings: z.boolean().optional(),
}).strict();

export const MemberSelectSchema: z.ZodType<Prisma.MemberSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  surname: z.boolean().optional(),
  email: z.boolean().optional(),
  phone: z.boolean().optional(),
  joinDate: z.boolean().optional(),
  status: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  membership: z.union([z.boolean(),z.lazy(() => MembershipArgsSchema)]).optional(),
  classBookings: z.union([z.boolean(),z.lazy(() => ClassBookingFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MemberCountOutputTypeArgsSchema)]).optional(),
}).strict()

// INSTRUCTOR
//------------------------------------------------------

export const InstructorIncludeSchema: z.ZodType<Prisma.InstructorInclude> = z.object({
  classSchedules: z.union([z.boolean(),z.lazy(() => ClassScheduleFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => InstructorCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const InstructorArgsSchema: z.ZodType<Prisma.InstructorDefaultArgs> = z.object({
  select: z.lazy(() => InstructorSelectSchema).optional(),
  include: z.lazy(() => InstructorIncludeSchema).optional(),
}).strict();

export const InstructorCountOutputTypeArgsSchema: z.ZodType<Prisma.InstructorCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => InstructorCountOutputTypeSelectSchema).nullish(),
}).strict();

export const InstructorCountOutputTypeSelectSchema: z.ZodType<Prisma.InstructorCountOutputTypeSelect> = z.object({
  classSchedules: z.boolean().optional(),
}).strict();

export const InstructorSelectSchema: z.ZodType<Prisma.InstructorSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  surname: z.boolean().optional(),
  email: z.boolean().optional(),
  phone: z.boolean().optional(),
  joinDate: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  classSchedules: z.union([z.boolean(),z.lazy(() => ClassScheduleFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => InstructorCountOutputTypeArgsSchema)]).optional(),
}).strict()

// MEMBERSHIP
//------------------------------------------------------

export const MembershipIncludeSchema: z.ZodType<Prisma.MembershipInclude> = z.object({
  member: z.union([z.boolean(),z.lazy(() => MemberArgsSchema)]).optional(),
  membershipPlan: z.union([z.boolean(),z.lazy(() => MembershipPlanArgsSchema)]).optional(),
}).strict();

export const MembershipArgsSchema: z.ZodType<Prisma.MembershipDefaultArgs> = z.object({
  select: z.lazy(() => MembershipSelectSchema).optional(),
  include: z.lazy(() => MembershipIncludeSchema).optional(),
}).strict();

export const MembershipSelectSchema: z.ZodType<Prisma.MembershipSelect> = z.object({
  id: z.boolean().optional(),
  startDate: z.boolean().optional(),
  endDate: z.boolean().optional(),
  status: z.boolean().optional(),
  lastPaymentMethod: z.boolean().optional(),
  lastPaymentDate: z.boolean().optional(),
  lastPaymentAmount: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  memberId: z.boolean().optional(),
  membershipPlanId: z.boolean().optional(),
  member: z.union([z.boolean(),z.lazy(() => MemberArgsSchema)]).optional(),
  membershipPlan: z.union([z.boolean(),z.lazy(() => MembershipPlanArgsSchema)]).optional(),
}).strict()

// MEMBERSHIP PLAN
//------------------------------------------------------

export const MembershipPlanIncludeSchema: z.ZodType<Prisma.MembershipPlanInclude> = z.object({
  memberships: z.union([z.boolean(),z.lazy(() => MembershipFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MembershipPlanCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const MembershipPlanArgsSchema: z.ZodType<Prisma.MembershipPlanDefaultArgs> = z.object({
  select: z.lazy(() => MembershipPlanSelectSchema).optional(),
  include: z.lazy(() => MembershipPlanIncludeSchema).optional(),
}).strict();

export const MembershipPlanCountOutputTypeArgsSchema: z.ZodType<Prisma.MembershipPlanCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => MembershipPlanCountOutputTypeSelectSchema).nullish(),
}).strict();

export const MembershipPlanCountOutputTypeSelectSchema: z.ZodType<Prisma.MembershipPlanCountOutputTypeSelect> = z.object({
  memberships: z.boolean().optional(),
}).strict();

export const MembershipPlanSelectSchema: z.ZodType<Prisma.MembershipPlanSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  price: z.boolean().optional(),
  durationDays: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  memberships: z.union([z.boolean(),z.lazy(() => MembershipFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MembershipPlanCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CLASS SCHEDULE
//------------------------------------------------------

export const ClassScheduleIncludeSchema: z.ZodType<Prisma.ClassScheduleInclude> = z.object({
  instructor: z.union([z.boolean(),z.lazy(() => InstructorArgsSchema)]).optional(),
  sessions: z.union([z.boolean(),z.lazy(() => ClassSessionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ClassScheduleCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const ClassScheduleArgsSchema: z.ZodType<Prisma.ClassScheduleDefaultArgs> = z.object({
  select: z.lazy(() => ClassScheduleSelectSchema).optional(),
  include: z.lazy(() => ClassScheduleIncludeSchema).optional(),
}).strict();

export const ClassScheduleCountOutputTypeArgsSchema: z.ZodType<Prisma.ClassScheduleCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ClassScheduleCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ClassScheduleCountOutputTypeSelectSchema: z.ZodType<Prisma.ClassScheduleCountOutputTypeSelect> = z.object({
  sessions: z.boolean().optional(),
}).strict();

export const ClassScheduleSelectSchema: z.ZodType<Prisma.ClassScheduleSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  category: z.boolean().optional(),
  maxCapacity: z.boolean().optional(),
  durationMinutes: z.boolean().optional(),
  instructorId: z.boolean().optional(),
  dayOfWeek: z.boolean().optional(),
  startTime: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  instructor: z.union([z.boolean(),z.lazy(() => InstructorArgsSchema)]).optional(),
  sessions: z.union([z.boolean(),z.lazy(() => ClassSessionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ClassScheduleCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CLASS SESSION
//------------------------------------------------------

export const ClassSessionIncludeSchema: z.ZodType<Prisma.ClassSessionInclude> = z.object({
  classSchedule: z.union([z.boolean(),z.lazy(() => ClassScheduleArgsSchema)]).optional(),
  bookings: z.union([z.boolean(),z.lazy(() => ClassBookingFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ClassSessionCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const ClassSessionArgsSchema: z.ZodType<Prisma.ClassSessionDefaultArgs> = z.object({
  select: z.lazy(() => ClassSessionSelectSchema).optional(),
  include: z.lazy(() => ClassSessionIncludeSchema).optional(),
}).strict();

export const ClassSessionCountOutputTypeArgsSchema: z.ZodType<Prisma.ClassSessionCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ClassSessionCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ClassSessionCountOutputTypeSelectSchema: z.ZodType<Prisma.ClassSessionCountOutputTypeSelect> = z.object({
  bookings: z.boolean().optional(),
}).strict();

export const ClassSessionSelectSchema: z.ZodType<Prisma.ClassSessionSelect> = z.object({
  id: z.boolean().optional(),
  classScheduleId: z.boolean().optional(),
  date: z.boolean().optional(),
  startTime: z.boolean().optional(),
  endTime: z.boolean().optional(),
  remainingCapacity: z.boolean().optional(),
  status: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  classSchedule: z.union([z.boolean(),z.lazy(() => ClassScheduleArgsSchema)]).optional(),
  bookings: z.union([z.boolean(),z.lazy(() => ClassBookingFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ClassSessionCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CLASS BOOKING
//------------------------------------------------------

export const ClassBookingIncludeSchema: z.ZodType<Prisma.ClassBookingInclude> = z.object({
  member: z.union([z.boolean(),z.lazy(() => MemberArgsSchema)]).optional(),
  classSession: z.union([z.boolean(),z.lazy(() => ClassSessionArgsSchema)]).optional(),
}).strict();

export const ClassBookingArgsSchema: z.ZodType<Prisma.ClassBookingDefaultArgs> = z.object({
  select: z.lazy(() => ClassBookingSelectSchema).optional(),
  include: z.lazy(() => ClassBookingIncludeSchema).optional(),
}).strict();

export const ClassBookingSelectSchema: z.ZodType<Prisma.ClassBookingSelect> = z.object({
  id: z.boolean().optional(),
  memberId: z.boolean().optional(),
  classSessionId: z.boolean().optional(),
  bookingDate: z.boolean().optional(),
  status: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  member: z.union([z.boolean(),z.lazy(() => MemberArgsSchema)]).optional(),
  classSession: z.union([z.boolean(),z.lazy(() => ClassSessionArgsSchema)]).optional(),
}).strict()

// EXERCISE
//------------------------------------------------------

export const ExerciseSelectSchema: z.ZodType<Prisma.ExerciseSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  muscleGroup: z.boolean().optional(),
  difficultyLevel: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const MemberWhereInputSchema: z.ZodType<Prisma.MemberWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MemberWhereInputSchema), z.lazy(() => MemberWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MemberWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MemberWhereInputSchema), z.lazy(() => MemberWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  surname: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  joinDate: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  status: z.union([ z.lazy(() => EnumStatusFilterSchema), z.lazy(() => StatusSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  membership: z.union([ z.lazy(() => MembershipNullableScalarRelationFilterSchema), z.lazy(() => MembershipWhereInputSchema) ]).optional().nullable(),
  classBookings: z.lazy(() => ClassBookingListRelationFilterSchema).optional(),
});

export const MemberOrderByWithRelationInputSchema: z.ZodType<Prisma.MemberOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  surname: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  joinDate: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  membership: z.lazy(() => MembershipOrderByWithRelationInputSchema).optional(),
  classBookings: z.lazy(() => ClassBookingOrderByRelationAggregateInputSchema).optional(),
  _relevance: z.lazy(() => MemberOrderByRelevanceInputSchema).optional(),
});

export const MemberWhereUniqueInputSchema: z.ZodType<Prisma.MemberWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    email: z.string(),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.strictObject({
  id: z.number().int().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => MemberWhereInputSchema), z.lazy(() => MemberWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MemberWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MemberWhereInputSchema), z.lazy(() => MemberWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  surname: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  joinDate: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  status: z.union([ z.lazy(() => EnumStatusFilterSchema), z.lazy(() => StatusSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  membership: z.union([ z.lazy(() => MembershipNullableScalarRelationFilterSchema), z.lazy(() => MembershipWhereInputSchema) ]).optional().nullable(),
  classBookings: z.lazy(() => ClassBookingListRelationFilterSchema).optional(),
}));

export const MemberOrderByWithAggregationInputSchema: z.ZodType<Prisma.MemberOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  surname: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  joinDate: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => MemberCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => MemberAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MemberMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MemberMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => MemberSumOrderByAggregateInputSchema).optional(),
});

export const MemberScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MemberScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MemberScalarWhereWithAggregatesInputSchema), z.lazy(() => MemberScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MemberScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MemberScalarWhereWithAggregatesInputSchema), z.lazy(() => MemberScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  surname: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  joinDate: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  status: z.union([ z.lazy(() => EnumStatusWithAggregatesFilterSchema), z.lazy(() => StatusSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date() ]).optional().nullable(),
});

export const InstructorWhereInputSchema: z.ZodType<Prisma.InstructorWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => InstructorWhereInputSchema), z.lazy(() => InstructorWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => InstructorWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InstructorWhereInputSchema), z.lazy(() => InstructorWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  surname: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  joinDate: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  classSchedules: z.lazy(() => ClassScheduleListRelationFilterSchema).optional(),
});

export const InstructorOrderByWithRelationInputSchema: z.ZodType<Prisma.InstructorOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  surname: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  joinDate: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  classSchedules: z.lazy(() => ClassScheduleOrderByRelationAggregateInputSchema).optional(),
  _relevance: z.lazy(() => InstructorOrderByRelevanceInputSchema).optional(),
});

export const InstructorWhereUniqueInputSchema: z.ZodType<Prisma.InstructorWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    email: z.string(),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.strictObject({
  id: z.number().int().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => InstructorWhereInputSchema), z.lazy(() => InstructorWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => InstructorWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InstructorWhereInputSchema), z.lazy(() => InstructorWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  surname: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  joinDate: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  classSchedules: z.lazy(() => ClassScheduleListRelationFilterSchema).optional(),
}));

export const InstructorOrderByWithAggregationInputSchema: z.ZodType<Prisma.InstructorOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  surname: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  joinDate: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => InstructorCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => InstructorAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => InstructorMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => InstructorMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => InstructorSumOrderByAggregateInputSchema).optional(),
});

export const InstructorScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.InstructorScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => InstructorScalarWhereWithAggregatesInputSchema), z.lazy(() => InstructorScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => InstructorScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InstructorScalarWhereWithAggregatesInputSchema), z.lazy(() => InstructorScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  surname: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  joinDate: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date() ]).optional().nullable(),
});

export const MembershipWhereInputSchema: z.ZodType<Prisma.MembershipWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MembershipWhereInputSchema), z.lazy(() => MembershipWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MembershipWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MembershipWhereInputSchema), z.lazy(() => MembershipWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  startDate: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  endDate: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  status: z.union([ z.lazy(() => EnumMembershipStatusFilterSchema), z.lazy(() => MembershipStatusSchema) ]).optional(),
  lastPaymentMethod: z.union([ z.lazy(() => EnumPaymentMethodNullableFilterSchema), z.lazy(() => PaymentMethodSchema) ]).optional().nullable(),
  lastPaymentDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  lastPaymentAmount: z.union([ z.lazy(() => DecimalNullableFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  memberId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  membershipPlanId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  member: z.union([ z.lazy(() => MemberScalarRelationFilterSchema), z.lazy(() => MemberWhereInputSchema) ]).optional(),
  membershipPlan: z.union([ z.lazy(() => MembershipPlanScalarRelationFilterSchema), z.lazy(() => MembershipPlanWhereInputSchema) ]).optional(),
});

export const MembershipOrderByWithRelationInputSchema: z.ZodType<Prisma.MembershipOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.lazy(() => SortOrderSchema).optional(),
  endDate: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  lastPaymentMethod: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastPaymentDate: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastPaymentAmount: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  memberId: z.lazy(() => SortOrderSchema).optional(),
  membershipPlanId: z.lazy(() => SortOrderSchema).optional(),
  member: z.lazy(() => MemberOrderByWithRelationInputSchema).optional(),
  membershipPlan: z.lazy(() => MembershipPlanOrderByWithRelationInputSchema).optional(),
});

export const MembershipWhereUniqueInputSchema: z.ZodType<Prisma.MembershipWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    memberId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    memberId: z.number().int(),
  }),
])
.and(z.strictObject({
  id: z.number().int().optional(),
  memberId: z.number().int().optional(),
  AND: z.union([ z.lazy(() => MembershipWhereInputSchema), z.lazy(() => MembershipWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MembershipWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MembershipWhereInputSchema), z.lazy(() => MembershipWhereInputSchema).array() ]).optional(),
  startDate: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  endDate: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  status: z.union([ z.lazy(() => EnumMembershipStatusFilterSchema), z.lazy(() => MembershipStatusSchema) ]).optional(),
  lastPaymentMethod: z.union([ z.lazy(() => EnumPaymentMethodNullableFilterSchema), z.lazy(() => PaymentMethodSchema) ]).optional().nullable(),
  lastPaymentDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  lastPaymentAmount: z.union([ z.lazy(() => DecimalNullableFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  membershipPlanId: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  member: z.union([ z.lazy(() => MemberScalarRelationFilterSchema), z.lazy(() => MemberWhereInputSchema) ]).optional(),
  membershipPlan: z.union([ z.lazy(() => MembershipPlanScalarRelationFilterSchema), z.lazy(() => MembershipPlanWhereInputSchema) ]).optional(),
}));

export const MembershipOrderByWithAggregationInputSchema: z.ZodType<Prisma.MembershipOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.lazy(() => SortOrderSchema).optional(),
  endDate: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  lastPaymentMethod: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastPaymentDate: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastPaymentAmount: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  memberId: z.lazy(() => SortOrderSchema).optional(),
  membershipPlanId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => MembershipCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => MembershipAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MembershipMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MembershipMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => MembershipSumOrderByAggregateInputSchema).optional(),
});

export const MembershipScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MembershipScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MembershipScalarWhereWithAggregatesInputSchema), z.lazy(() => MembershipScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MembershipScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MembershipScalarWhereWithAggregatesInputSchema), z.lazy(() => MembershipScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  startDate: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  endDate: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  status: z.union([ z.lazy(() => EnumMembershipStatusWithAggregatesFilterSchema), z.lazy(() => MembershipStatusSchema) ]).optional(),
  lastPaymentMethod: z.union([ z.lazy(() => EnumPaymentMethodNullableWithAggregatesFilterSchema), z.lazy(() => PaymentMethodSchema) ]).optional().nullable(),
  lastPaymentDate: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date() ]).optional().nullable(),
  lastPaymentAmount: z.union([ z.lazy(() => DecimalNullableWithAggregatesFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date() ]).optional().nullable(),
  memberId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  membershipPlanId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
});

export const MembershipPlanWhereInputSchema: z.ZodType<Prisma.MembershipPlanWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MembershipPlanWhereInputSchema), z.lazy(() => MembershipPlanWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MembershipPlanWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MembershipPlanWhereInputSchema), z.lazy(() => MembershipPlanWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  price: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  durationDays: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  memberships: z.lazy(() => MembershipListRelationFilterSchema).optional(),
});

export const MembershipPlanOrderByWithRelationInputSchema: z.ZodType<Prisma.MembershipPlanOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  durationDays: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  memberships: z.lazy(() => MembershipOrderByRelationAggregateInputSchema).optional(),
  _relevance: z.lazy(() => MembershipPlanOrderByRelevanceInputSchema).optional(),
});

export const MembershipPlanWhereUniqueInputSchema: z.ZodType<Prisma.MembershipPlanWhereUniqueInput> = z.object({
  id: z.number().int(),
})
.and(z.strictObject({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => MembershipPlanWhereInputSchema), z.lazy(() => MembershipPlanWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MembershipPlanWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MembershipPlanWhereInputSchema), z.lazy(() => MembershipPlanWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  price: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  durationDays: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  memberships: z.lazy(() => MembershipListRelationFilterSchema).optional(),
}));

export const MembershipPlanOrderByWithAggregationInputSchema: z.ZodType<Prisma.MembershipPlanOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  durationDays: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => MembershipPlanCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => MembershipPlanAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MembershipPlanMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MembershipPlanMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => MembershipPlanSumOrderByAggregateInputSchema).optional(),
});

export const MembershipPlanScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MembershipPlanScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MembershipPlanScalarWhereWithAggregatesInputSchema), z.lazy(() => MembershipPlanScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MembershipPlanScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MembershipPlanScalarWhereWithAggregatesInputSchema), z.lazy(() => MembershipPlanScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  price: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema), z.number() ]).optional(),
  durationDays: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date() ]).optional().nullable(),
});

export const ClassScheduleWhereInputSchema: z.ZodType<Prisma.ClassScheduleWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ClassScheduleWhereInputSchema), z.lazy(() => ClassScheduleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClassScheduleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClassScheduleWhereInputSchema), z.lazy(() => ClassScheduleWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  category: z.union([ z.lazy(() => EnumClassCategoryFilterSchema), z.lazy(() => ClassCategorySchema) ]).optional(),
  maxCapacity: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  durationMinutes: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  instructorId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  dayOfWeek: z.union([ z.lazy(() => EnumDayOfWeekFilterSchema), z.lazy(() => DayOfWeekSchema) ]).optional(),
  startTime: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  instructor: z.union([ z.lazy(() => InstructorScalarRelationFilterSchema), z.lazy(() => InstructorWhereInputSchema) ]).optional(),
  sessions: z.lazy(() => ClassSessionListRelationFilterSchema).optional(),
});

export const ClassScheduleOrderByWithRelationInputSchema: z.ZodType<Prisma.ClassScheduleOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  maxCapacity: z.lazy(() => SortOrderSchema).optional(),
  durationMinutes: z.lazy(() => SortOrderSchema).optional(),
  instructorId: z.lazy(() => SortOrderSchema).optional(),
  dayOfWeek: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  instructor: z.lazy(() => InstructorOrderByWithRelationInputSchema).optional(),
  sessions: z.lazy(() => ClassSessionOrderByRelationAggregateInputSchema).optional(),
  _relevance: z.lazy(() => ClassScheduleOrderByRelevanceInputSchema).optional(),
});

export const ClassScheduleWhereUniqueInputSchema: z.ZodType<Prisma.ClassScheduleWhereUniqueInput> = z.object({
  id: z.number().int(),
})
.and(z.strictObject({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => ClassScheduleWhereInputSchema), z.lazy(() => ClassScheduleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClassScheduleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClassScheduleWhereInputSchema), z.lazy(() => ClassScheduleWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  category: z.union([ z.lazy(() => EnumClassCategoryFilterSchema), z.lazy(() => ClassCategorySchema) ]).optional(),
  maxCapacity: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  durationMinutes: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  instructorId: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  dayOfWeek: z.union([ z.lazy(() => EnumDayOfWeekFilterSchema), z.lazy(() => DayOfWeekSchema) ]).optional(),
  startTime: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  instructor: z.union([ z.lazy(() => InstructorScalarRelationFilterSchema), z.lazy(() => InstructorWhereInputSchema) ]).optional(),
  sessions: z.lazy(() => ClassSessionListRelationFilterSchema).optional(),
}));

export const ClassScheduleOrderByWithAggregationInputSchema: z.ZodType<Prisma.ClassScheduleOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  maxCapacity: z.lazy(() => SortOrderSchema).optional(),
  durationMinutes: z.lazy(() => SortOrderSchema).optional(),
  instructorId: z.lazy(() => SortOrderSchema).optional(),
  dayOfWeek: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ClassScheduleCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ClassScheduleAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ClassScheduleMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ClassScheduleMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ClassScheduleSumOrderByAggregateInputSchema).optional(),
});

export const ClassScheduleScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ClassScheduleScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ClassScheduleScalarWhereWithAggregatesInputSchema), z.lazy(() => ClassScheduleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClassScheduleScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClassScheduleScalarWhereWithAggregatesInputSchema), z.lazy(() => ClassScheduleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  category: z.union([ z.lazy(() => EnumClassCategoryWithAggregatesFilterSchema), z.lazy(() => ClassCategorySchema) ]).optional(),
  maxCapacity: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  durationMinutes: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  instructorId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  dayOfWeek: z.union([ z.lazy(() => EnumDayOfWeekWithAggregatesFilterSchema), z.lazy(() => DayOfWeekSchema) ]).optional(),
  startTime: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date() ]).optional().nullable(),
});

export const ClassSessionWhereInputSchema: z.ZodType<Prisma.ClassSessionWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ClassSessionWhereInputSchema), z.lazy(() => ClassSessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClassSessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClassSessionWhereInputSchema), z.lazy(() => ClassSessionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  classScheduleId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  startTime: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  endTime: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  remainingCapacity: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  status: z.union([ z.lazy(() => EnumClassStatusFilterSchema), z.lazy(() => ClassStatusSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  classSchedule: z.union([ z.lazy(() => ClassScheduleScalarRelationFilterSchema), z.lazy(() => ClassScheduleWhereInputSchema) ]).optional(),
  bookings: z.lazy(() => ClassBookingListRelationFilterSchema).optional(),
});

export const ClassSessionOrderByWithRelationInputSchema: z.ZodType<Prisma.ClassSessionOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  classScheduleId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional(),
  remainingCapacity: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  classSchedule: z.lazy(() => ClassScheduleOrderByWithRelationInputSchema).optional(),
  bookings: z.lazy(() => ClassBookingOrderByRelationAggregateInputSchema).optional(),
});

export const ClassSessionWhereUniqueInputSchema: z.ZodType<Prisma.ClassSessionWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    classScheduleId_date_startTime: z.lazy(() => ClassSessionClassScheduleIdDateStartTimeCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    classScheduleId_date_startTime: z.lazy(() => ClassSessionClassScheduleIdDateStartTimeCompoundUniqueInputSchema),
  }),
])
.and(z.strictObject({
  id: z.number().int().optional(),
  classScheduleId_date_startTime: z.lazy(() => ClassSessionClassScheduleIdDateStartTimeCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => ClassSessionWhereInputSchema), z.lazy(() => ClassSessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClassSessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClassSessionWhereInputSchema), z.lazy(() => ClassSessionWhereInputSchema).array() ]).optional(),
  classScheduleId: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  startTime: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  endTime: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  remainingCapacity: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  status: z.union([ z.lazy(() => EnumClassStatusFilterSchema), z.lazy(() => ClassStatusSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  classSchedule: z.union([ z.lazy(() => ClassScheduleScalarRelationFilterSchema), z.lazy(() => ClassScheduleWhereInputSchema) ]).optional(),
  bookings: z.lazy(() => ClassBookingListRelationFilterSchema).optional(),
}));

export const ClassSessionOrderByWithAggregationInputSchema: z.ZodType<Prisma.ClassSessionOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  classScheduleId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional(),
  remainingCapacity: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ClassSessionCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ClassSessionAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ClassSessionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ClassSessionMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ClassSessionSumOrderByAggregateInputSchema).optional(),
});

export const ClassSessionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ClassSessionScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ClassSessionScalarWhereWithAggregatesInputSchema), z.lazy(() => ClassSessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClassSessionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClassSessionScalarWhereWithAggregatesInputSchema), z.lazy(() => ClassSessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  classScheduleId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  startTime: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  endTime: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  remainingCapacity: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  status: z.union([ z.lazy(() => EnumClassStatusWithAggregatesFilterSchema), z.lazy(() => ClassStatusSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date() ]).optional().nullable(),
});

export const ClassBookingWhereInputSchema: z.ZodType<Prisma.ClassBookingWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ClassBookingWhereInputSchema), z.lazy(() => ClassBookingWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClassBookingWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClassBookingWhereInputSchema), z.lazy(() => ClassBookingWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  memberId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  classSessionId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  bookingDate: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  status: z.union([ z.lazy(() => EnumClassBookingStatusFilterSchema), z.lazy(() => ClassBookingStatusSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  member: z.union([ z.lazy(() => MemberScalarRelationFilterSchema), z.lazy(() => MemberWhereInputSchema) ]).optional(),
  classSession: z.union([ z.lazy(() => ClassSessionScalarRelationFilterSchema), z.lazy(() => ClassSessionWhereInputSchema) ]).optional(),
});

export const ClassBookingOrderByWithRelationInputSchema: z.ZodType<Prisma.ClassBookingOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  memberId: z.lazy(() => SortOrderSchema).optional(),
  classSessionId: z.lazy(() => SortOrderSchema).optional(),
  bookingDate: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  member: z.lazy(() => MemberOrderByWithRelationInputSchema).optional(),
  classSession: z.lazy(() => ClassSessionOrderByWithRelationInputSchema).optional(),
});

export const ClassBookingWhereUniqueInputSchema: z.ZodType<Prisma.ClassBookingWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    memberId_classSessionId: z.lazy(() => ClassBookingMemberIdClassSessionIdCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    memberId_classSessionId: z.lazy(() => ClassBookingMemberIdClassSessionIdCompoundUniqueInputSchema),
  }),
])
.and(z.strictObject({
  id: z.number().int().optional(),
  memberId_classSessionId: z.lazy(() => ClassBookingMemberIdClassSessionIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => ClassBookingWhereInputSchema), z.lazy(() => ClassBookingWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClassBookingWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClassBookingWhereInputSchema), z.lazy(() => ClassBookingWhereInputSchema).array() ]).optional(),
  memberId: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  classSessionId: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  bookingDate: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  status: z.union([ z.lazy(() => EnumClassBookingStatusFilterSchema), z.lazy(() => ClassBookingStatusSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  member: z.union([ z.lazy(() => MemberScalarRelationFilterSchema), z.lazy(() => MemberWhereInputSchema) ]).optional(),
  classSession: z.union([ z.lazy(() => ClassSessionScalarRelationFilterSchema), z.lazy(() => ClassSessionWhereInputSchema) ]).optional(),
}));

export const ClassBookingOrderByWithAggregationInputSchema: z.ZodType<Prisma.ClassBookingOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  memberId: z.lazy(() => SortOrderSchema).optional(),
  classSessionId: z.lazy(() => SortOrderSchema).optional(),
  bookingDate: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ClassBookingCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ClassBookingAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ClassBookingMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ClassBookingMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ClassBookingSumOrderByAggregateInputSchema).optional(),
});

export const ClassBookingScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ClassBookingScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ClassBookingScalarWhereWithAggregatesInputSchema), z.lazy(() => ClassBookingScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClassBookingScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClassBookingScalarWhereWithAggregatesInputSchema), z.lazy(() => ClassBookingScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  memberId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  classSessionId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  bookingDate: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  status: z.union([ z.lazy(() => EnumClassBookingStatusWithAggregatesFilterSchema), z.lazy(() => ClassBookingStatusSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date() ]).optional().nullable(),
});

export const ExerciseWhereInputSchema: z.ZodType<Prisma.ExerciseWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ExerciseWhereInputSchema), z.lazy(() => ExerciseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExerciseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExerciseWhereInputSchema), z.lazy(() => ExerciseWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  muscleGroup: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  difficultyLevel: z.union([ z.lazy(() => EnumDifficultyLevelExerciseFilterSchema), z.lazy(() => DifficultyLevelExerciseSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
});

export const ExerciseOrderByWithRelationInputSchema: z.ZodType<Prisma.ExerciseOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  muscleGroup: z.lazy(() => SortOrderSchema).optional(),
  difficultyLevel: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _relevance: z.lazy(() => ExerciseOrderByRelevanceInputSchema).optional(),
});

export const ExerciseWhereUniqueInputSchema: z.ZodType<Prisma.ExerciseWhereUniqueInput> = z.object({
  id: z.number().int(),
})
.and(z.strictObject({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => ExerciseWhereInputSchema), z.lazy(() => ExerciseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExerciseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExerciseWhereInputSchema), z.lazy(() => ExerciseWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  muscleGroup: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  difficultyLevel: z.union([ z.lazy(() => EnumDifficultyLevelExerciseFilterSchema), z.lazy(() => DifficultyLevelExerciseSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
}));

export const ExerciseOrderByWithAggregationInputSchema: z.ZodType<Prisma.ExerciseOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  muscleGroup: z.lazy(() => SortOrderSchema).optional(),
  difficultyLevel: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ExerciseCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ExerciseAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ExerciseMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ExerciseMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ExerciseSumOrderByAggregateInputSchema).optional(),
});

export const ExerciseScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ExerciseScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ExerciseScalarWhereWithAggregatesInputSchema), z.lazy(() => ExerciseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExerciseScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExerciseScalarWhereWithAggregatesInputSchema), z.lazy(() => ExerciseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  muscleGroup: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  difficultyLevel: z.union([ z.lazy(() => EnumDifficultyLevelExerciseWithAggregatesFilterSchema), z.lazy(() => DifficultyLevelExerciseSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date() ]).optional().nullable(),
});

export const MemberCreateInputSchema: z.ZodType<Prisma.MemberCreateInput> = z.strictObject({
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  phone: z.string().optional().nullable(),
  joinDate: z.coerce.date().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  membership: z.lazy(() => MembershipCreateNestedOneWithoutMemberInputSchema).optional(),
  classBookings: z.lazy(() => ClassBookingCreateNestedManyWithoutMemberInputSchema).optional(),
});

export const MemberUncheckedCreateInputSchema: z.ZodType<Prisma.MemberUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  phone: z.string().optional().nullable(),
  joinDate: z.coerce.date().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  membership: z.lazy(() => MembershipUncheckedCreateNestedOneWithoutMemberInputSchema).optional(),
  classBookings: z.lazy(() => ClassBookingUncheckedCreateNestedManyWithoutMemberInputSchema).optional(),
});

export const MemberUpdateInputSchema: z.ZodType<Prisma.MemberUpdateInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  surname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joinDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema), z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  membership: z.lazy(() => MembershipUpdateOneWithoutMemberNestedInputSchema).optional(),
  classBookings: z.lazy(() => ClassBookingUpdateManyWithoutMemberNestedInputSchema).optional(),
});

export const MemberUncheckedUpdateInputSchema: z.ZodType<Prisma.MemberUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  surname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joinDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema), z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  membership: z.lazy(() => MembershipUncheckedUpdateOneWithoutMemberNestedInputSchema).optional(),
  classBookings: z.lazy(() => ClassBookingUncheckedUpdateManyWithoutMemberNestedInputSchema).optional(),
});

export const MemberCreateManyInputSchema: z.ZodType<Prisma.MemberCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  phone: z.string().optional().nullable(),
  joinDate: z.coerce.date().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
});

export const MemberUpdateManyMutationInputSchema: z.ZodType<Prisma.MemberUpdateManyMutationInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  surname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joinDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema), z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const MemberUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MemberUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  surname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joinDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema), z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const InstructorCreateInputSchema: z.ZodType<Prisma.InstructorCreateInput> = z.strictObject({
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  phone: z.string().optional().nullable(),
  joinDate: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  classSchedules: z.lazy(() => ClassScheduleCreateNestedManyWithoutInstructorInputSchema).optional(),
});

export const InstructorUncheckedCreateInputSchema: z.ZodType<Prisma.InstructorUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  phone: z.string().optional().nullable(),
  joinDate: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  classSchedules: z.lazy(() => ClassScheduleUncheckedCreateNestedManyWithoutInstructorInputSchema).optional(),
});

export const InstructorUpdateInputSchema: z.ZodType<Prisma.InstructorUpdateInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  surname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joinDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  classSchedules: z.lazy(() => ClassScheduleUpdateManyWithoutInstructorNestedInputSchema).optional(),
});

export const InstructorUncheckedUpdateInputSchema: z.ZodType<Prisma.InstructorUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  surname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joinDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  classSchedules: z.lazy(() => ClassScheduleUncheckedUpdateManyWithoutInstructorNestedInputSchema).optional(),
});

export const InstructorCreateManyInputSchema: z.ZodType<Prisma.InstructorCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  phone: z.string().optional().nullable(),
  joinDate: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
});

export const InstructorUpdateManyMutationInputSchema: z.ZodType<Prisma.InstructorUpdateManyMutationInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  surname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joinDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const InstructorUncheckedUpdateManyInputSchema: z.ZodType<Prisma.InstructorUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  surname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joinDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const MembershipCreateInputSchema: z.ZodType<Prisma.MembershipCreateInput> = z.strictObject({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date(),
  status: z.lazy(() => MembershipStatusSchema).optional(),
  lastPaymentMethod: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  lastPaymentDate: z.coerce.date().optional().nullable(),
  lastPaymentAmount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  member: z.lazy(() => MemberCreateNestedOneWithoutMembershipInputSchema),
  membershipPlan: z.lazy(() => MembershipPlanCreateNestedOneWithoutMembershipsInputSchema),
});

export const MembershipUncheckedCreateInputSchema: z.ZodType<Prisma.MembershipUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date(),
  status: z.lazy(() => MembershipStatusSchema).optional(),
  lastPaymentMethod: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  lastPaymentDate: z.coerce.date().optional().nullable(),
  lastPaymentAmount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  memberId: z.number().int(),
  membershipPlanId: z.number().int(),
});

export const MembershipUpdateInputSchema: z.ZodType<Prisma.MembershipUpdateInput> = z.strictObject({
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => MembershipStatusSchema), z.lazy(() => EnumMembershipStatusFieldUpdateOperationsInputSchema) ]).optional(),
  lastPaymentMethod: z.union([ z.lazy(() => PaymentMethodSchema), z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastPaymentDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastPaymentAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  member: z.lazy(() => MemberUpdateOneRequiredWithoutMembershipNestedInputSchema).optional(),
  membershipPlan: z.lazy(() => MembershipPlanUpdateOneRequiredWithoutMembershipsNestedInputSchema).optional(),
});

export const MembershipUncheckedUpdateInputSchema: z.ZodType<Prisma.MembershipUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => MembershipStatusSchema), z.lazy(() => EnumMembershipStatusFieldUpdateOperationsInputSchema) ]).optional(),
  lastPaymentMethod: z.union([ z.lazy(() => PaymentMethodSchema), z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastPaymentDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastPaymentAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  memberId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  membershipPlanId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MembershipCreateManyInputSchema: z.ZodType<Prisma.MembershipCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date(),
  status: z.lazy(() => MembershipStatusSchema).optional(),
  lastPaymentMethod: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  lastPaymentDate: z.coerce.date().optional().nullable(),
  lastPaymentAmount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  memberId: z.number().int(),
  membershipPlanId: z.number().int(),
});

export const MembershipUpdateManyMutationInputSchema: z.ZodType<Prisma.MembershipUpdateManyMutationInput> = z.strictObject({
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => MembershipStatusSchema), z.lazy(() => EnumMembershipStatusFieldUpdateOperationsInputSchema) ]).optional(),
  lastPaymentMethod: z.union([ z.lazy(() => PaymentMethodSchema), z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastPaymentDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastPaymentAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const MembershipUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MembershipUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => MembershipStatusSchema), z.lazy(() => EnumMembershipStatusFieldUpdateOperationsInputSchema) ]).optional(),
  lastPaymentMethod: z.union([ z.lazy(() => PaymentMethodSchema), z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastPaymentDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastPaymentAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  memberId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  membershipPlanId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MembershipPlanCreateInputSchema: z.ZodType<Prisma.MembershipPlanCreateInput> = z.strictObject({
  name: z.string(),
  description: z.string().optional().nullable(),
  price: z.number(),
  durationDays: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  memberships: z.lazy(() => MembershipCreateNestedManyWithoutMembershipPlanInputSchema).optional(),
});

export const MembershipPlanUncheckedCreateInputSchema: z.ZodType<Prisma.MembershipPlanUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  price: z.number(),
  durationDays: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  memberships: z.lazy(() => MembershipUncheckedCreateNestedManyWithoutMembershipPlanInputSchema).optional(),
});

export const MembershipPlanUpdateInputSchema: z.ZodType<Prisma.MembershipPlanUpdateInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  durationDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  memberships: z.lazy(() => MembershipUpdateManyWithoutMembershipPlanNestedInputSchema).optional(),
});

export const MembershipPlanUncheckedUpdateInputSchema: z.ZodType<Prisma.MembershipPlanUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  durationDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  memberships: z.lazy(() => MembershipUncheckedUpdateManyWithoutMembershipPlanNestedInputSchema).optional(),
});

export const MembershipPlanCreateManyInputSchema: z.ZodType<Prisma.MembershipPlanCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  price: z.number(),
  durationDays: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
});

export const MembershipPlanUpdateManyMutationInputSchema: z.ZodType<Prisma.MembershipPlanUpdateManyMutationInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  durationDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const MembershipPlanUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MembershipPlanUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  durationDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ClassScheduleCreateInputSchema: z.ZodType<Prisma.ClassScheduleCreateInput> = z.strictObject({
  name: z.string(),
  description: z.string().optional().nullable(),
  category: z.lazy(() => ClassCategorySchema),
  maxCapacity: z.number().int(),
  durationMinutes: z.number().int(),
  dayOfWeek: z.lazy(() => DayOfWeekSchema),
  startTime: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  instructor: z.lazy(() => InstructorCreateNestedOneWithoutClassSchedulesInputSchema),
  sessions: z.lazy(() => ClassSessionCreateNestedManyWithoutClassScheduleInputSchema).optional(),
});

export const ClassScheduleUncheckedCreateInputSchema: z.ZodType<Prisma.ClassScheduleUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  category: z.lazy(() => ClassCategorySchema),
  maxCapacity: z.number().int(),
  durationMinutes: z.number().int(),
  instructorId: z.number().int(),
  dayOfWeek: z.lazy(() => DayOfWeekSchema),
  startTime: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  sessions: z.lazy(() => ClassSessionUncheckedCreateNestedManyWithoutClassScheduleInputSchema).optional(),
});

export const ClassScheduleUpdateInputSchema: z.ZodType<Prisma.ClassScheduleUpdateInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => ClassCategorySchema), z.lazy(() => EnumClassCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  maxCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  durationMinutes: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dayOfWeek: z.union([ z.lazy(() => DayOfWeekSchema), z.lazy(() => EnumDayOfWeekFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  instructor: z.lazy(() => InstructorUpdateOneRequiredWithoutClassSchedulesNestedInputSchema).optional(),
  sessions: z.lazy(() => ClassSessionUpdateManyWithoutClassScheduleNestedInputSchema).optional(),
});

export const ClassScheduleUncheckedUpdateInputSchema: z.ZodType<Prisma.ClassScheduleUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => ClassCategorySchema), z.lazy(() => EnumClassCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  maxCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  durationMinutes: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  instructorId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dayOfWeek: z.union([ z.lazy(() => DayOfWeekSchema), z.lazy(() => EnumDayOfWeekFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sessions: z.lazy(() => ClassSessionUncheckedUpdateManyWithoutClassScheduleNestedInputSchema).optional(),
});

export const ClassScheduleCreateManyInputSchema: z.ZodType<Prisma.ClassScheduleCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  category: z.lazy(() => ClassCategorySchema),
  maxCapacity: z.number().int(),
  durationMinutes: z.number().int(),
  instructorId: z.number().int(),
  dayOfWeek: z.lazy(() => DayOfWeekSchema),
  startTime: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
});

export const ClassScheduleUpdateManyMutationInputSchema: z.ZodType<Prisma.ClassScheduleUpdateManyMutationInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => ClassCategorySchema), z.lazy(() => EnumClassCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  maxCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  durationMinutes: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dayOfWeek: z.union([ z.lazy(() => DayOfWeekSchema), z.lazy(() => EnumDayOfWeekFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ClassScheduleUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ClassScheduleUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => ClassCategorySchema), z.lazy(() => EnumClassCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  maxCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  durationMinutes: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  instructorId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dayOfWeek: z.union([ z.lazy(() => DayOfWeekSchema), z.lazy(() => EnumDayOfWeekFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ClassSessionCreateInputSchema: z.ZodType<Prisma.ClassSessionCreateInput> = z.strictObject({
  date: z.coerce.date(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  remainingCapacity: z.number().int(),
  status: z.lazy(() => ClassStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  classSchedule: z.lazy(() => ClassScheduleCreateNestedOneWithoutSessionsInputSchema),
  bookings: z.lazy(() => ClassBookingCreateNestedManyWithoutClassSessionInputSchema).optional(),
});

export const ClassSessionUncheckedCreateInputSchema: z.ZodType<Prisma.ClassSessionUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  classScheduleId: z.number().int(),
  date: z.coerce.date(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  remainingCapacity: z.number().int(),
  status: z.lazy(() => ClassStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  bookings: z.lazy(() => ClassBookingUncheckedCreateNestedManyWithoutClassSessionInputSchema).optional(),
});

export const ClassSessionUpdateInputSchema: z.ZodType<Prisma.ClassSessionUpdateInput> = z.strictObject({
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  remainingCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClassStatusSchema), z.lazy(() => EnumClassStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  classSchedule: z.lazy(() => ClassScheduleUpdateOneRequiredWithoutSessionsNestedInputSchema).optional(),
  bookings: z.lazy(() => ClassBookingUpdateManyWithoutClassSessionNestedInputSchema).optional(),
});

export const ClassSessionUncheckedUpdateInputSchema: z.ZodType<Prisma.ClassSessionUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  classScheduleId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  remainingCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClassStatusSchema), z.lazy(() => EnumClassStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bookings: z.lazy(() => ClassBookingUncheckedUpdateManyWithoutClassSessionNestedInputSchema).optional(),
});

export const ClassSessionCreateManyInputSchema: z.ZodType<Prisma.ClassSessionCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  classScheduleId: z.number().int(),
  date: z.coerce.date(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  remainingCapacity: z.number().int(),
  status: z.lazy(() => ClassStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
});

export const ClassSessionUpdateManyMutationInputSchema: z.ZodType<Prisma.ClassSessionUpdateManyMutationInput> = z.strictObject({
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  remainingCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClassStatusSchema), z.lazy(() => EnumClassStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ClassSessionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ClassSessionUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  classScheduleId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  remainingCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClassStatusSchema), z.lazy(() => EnumClassStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ClassBookingCreateInputSchema: z.ZodType<Prisma.ClassBookingCreateInput> = z.strictObject({
  bookingDate: z.coerce.date().optional(),
  status: z.lazy(() => ClassBookingStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  member: z.lazy(() => MemberCreateNestedOneWithoutClassBookingsInputSchema),
  classSession: z.lazy(() => ClassSessionCreateNestedOneWithoutBookingsInputSchema),
});

export const ClassBookingUncheckedCreateInputSchema: z.ZodType<Prisma.ClassBookingUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  memberId: z.number().int(),
  classSessionId: z.number().int(),
  bookingDate: z.coerce.date().optional(),
  status: z.lazy(() => ClassBookingStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
});

export const ClassBookingUpdateInputSchema: z.ZodType<Prisma.ClassBookingUpdateInput> = z.strictObject({
  bookingDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClassBookingStatusSchema), z.lazy(() => EnumClassBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  member: z.lazy(() => MemberUpdateOneRequiredWithoutClassBookingsNestedInputSchema).optional(),
  classSession: z.lazy(() => ClassSessionUpdateOneRequiredWithoutBookingsNestedInputSchema).optional(),
});

export const ClassBookingUncheckedUpdateInputSchema: z.ZodType<Prisma.ClassBookingUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  memberId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  classSessionId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bookingDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClassBookingStatusSchema), z.lazy(() => EnumClassBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ClassBookingCreateManyInputSchema: z.ZodType<Prisma.ClassBookingCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  memberId: z.number().int(),
  classSessionId: z.number().int(),
  bookingDate: z.coerce.date().optional(),
  status: z.lazy(() => ClassBookingStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
});

export const ClassBookingUpdateManyMutationInputSchema: z.ZodType<Prisma.ClassBookingUpdateManyMutationInput> = z.strictObject({
  bookingDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClassBookingStatusSchema), z.lazy(() => EnumClassBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ClassBookingUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ClassBookingUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  memberId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  classSessionId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bookingDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClassBookingStatusSchema), z.lazy(() => EnumClassBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ExerciseCreateInputSchema: z.ZodType<Prisma.ExerciseCreateInput> = z.strictObject({
  name: z.string(),
  description: z.string().optional().nullable(),
  muscleGroup: z.string(),
  difficultyLevel: z.lazy(() => DifficultyLevelExerciseSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
});

export const ExerciseUncheckedCreateInputSchema: z.ZodType<Prisma.ExerciseUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  muscleGroup: z.string(),
  difficultyLevel: z.lazy(() => DifficultyLevelExerciseSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
});

export const ExerciseUpdateInputSchema: z.ZodType<Prisma.ExerciseUpdateInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  muscleGroup: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  difficultyLevel: z.union([ z.lazy(() => DifficultyLevelExerciseSchema), z.lazy(() => EnumDifficultyLevelExerciseFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ExerciseUncheckedUpdateInputSchema: z.ZodType<Prisma.ExerciseUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  muscleGroup: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  difficultyLevel: z.union([ z.lazy(() => DifficultyLevelExerciseSchema), z.lazy(() => EnumDifficultyLevelExerciseFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ExerciseCreateManyInputSchema: z.ZodType<Prisma.ExerciseCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  muscleGroup: z.string(),
  difficultyLevel: z.lazy(() => DifficultyLevelExerciseSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
});

export const ExerciseUpdateManyMutationInputSchema: z.ZodType<Prisma.ExerciseUpdateManyMutationInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  muscleGroup: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  difficultyLevel: z.union([ z.lazy(() => DifficultyLevelExerciseSchema), z.lazy(() => EnumDifficultyLevelExerciseFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ExerciseUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ExerciseUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  muscleGroup: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  difficultyLevel: z.union([ z.lazy(() => DifficultyLevelExerciseSchema), z.lazy(() => EnumDifficultyLevelExerciseFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
});

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
});

export const EnumStatusFilterSchema: z.ZodType<Prisma.EnumStatusFilter> = z.strictObject({
  equals: z.lazy(() => StatusSchema).optional(),
  in: z.lazy(() => StatusSchema).array().optional(),
  notIn: z.lazy(() => StatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StatusSchema), z.lazy(() => NestedEnumStatusFilterSchema) ]).optional(),
});

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
});

export const MembershipNullableScalarRelationFilterSchema: z.ZodType<Prisma.MembershipNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => MembershipWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => MembershipWhereInputSchema).optional().nullable(),
});

export const ClassBookingListRelationFilterSchema: z.ZodType<Prisma.ClassBookingListRelationFilter> = z.strictObject({
  every: z.lazy(() => ClassBookingWhereInputSchema).optional(),
  some: z.lazy(() => ClassBookingWhereInputSchema).optional(),
  none: z.lazy(() => ClassBookingWhereInputSchema).optional(),
});

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.strictObject({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional(),
});

export const ClassBookingOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ClassBookingOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const MemberOrderByRelevanceInputSchema: z.ZodType<Prisma.MemberOrderByRelevanceInput> = z.strictObject({
  fields: z.union([ z.lazy(() => MemberOrderByRelevanceFieldEnumSchema), z.lazy(() => MemberOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string(),
});

export const MemberCountOrderByAggregateInputSchema: z.ZodType<Prisma.MemberCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  surname: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  joinDate: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const MemberAvgOrderByAggregateInputSchema: z.ZodType<Prisma.MemberAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
});

export const MemberMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MemberMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  surname: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  joinDate: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const MemberMinOrderByAggregateInputSchema: z.ZodType<Prisma.MemberMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  surname: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  joinDate: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const MemberSumOrderByAggregateInputSchema: z.ZodType<Prisma.MemberSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
});

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
});

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
});

export const EnumStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumStatusWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => StatusSchema).optional(),
  in: z.lazy(() => StatusSchema).array().optional(),
  notIn: z.lazy(() => StatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StatusSchema), z.lazy(() => NestedEnumStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumStatusFilterSchema).optional(),
});

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
});

export const ClassScheduleListRelationFilterSchema: z.ZodType<Prisma.ClassScheduleListRelationFilter> = z.strictObject({
  every: z.lazy(() => ClassScheduleWhereInputSchema).optional(),
  some: z.lazy(() => ClassScheduleWhereInputSchema).optional(),
  none: z.lazy(() => ClassScheduleWhereInputSchema).optional(),
});

export const ClassScheduleOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ClassScheduleOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const InstructorOrderByRelevanceInputSchema: z.ZodType<Prisma.InstructorOrderByRelevanceInput> = z.strictObject({
  fields: z.union([ z.lazy(() => InstructorOrderByRelevanceFieldEnumSchema), z.lazy(() => InstructorOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string(),
});

export const InstructorCountOrderByAggregateInputSchema: z.ZodType<Prisma.InstructorCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  surname: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  joinDate: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const InstructorAvgOrderByAggregateInputSchema: z.ZodType<Prisma.InstructorAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
});

export const InstructorMaxOrderByAggregateInputSchema: z.ZodType<Prisma.InstructorMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  surname: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  joinDate: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const InstructorMinOrderByAggregateInputSchema: z.ZodType<Prisma.InstructorMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  surname: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  joinDate: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const InstructorSumOrderByAggregateInputSchema: z.ZodType<Prisma.InstructorSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
});

export const EnumMembershipStatusFilterSchema: z.ZodType<Prisma.EnumMembershipStatusFilter> = z.strictObject({
  equals: z.lazy(() => MembershipStatusSchema).optional(),
  in: z.lazy(() => MembershipStatusSchema).array().optional(),
  notIn: z.lazy(() => MembershipStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => MembershipStatusSchema), z.lazy(() => NestedEnumMembershipStatusFilterSchema) ]).optional(),
});

export const EnumPaymentMethodNullableFilterSchema: z.ZodType<Prisma.EnumPaymentMethodNullableFilter> = z.strictObject({
  equals: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  in: z.lazy(() => PaymentMethodSchema).array().optional().nullable(),
  notIn: z.lazy(() => PaymentMethodSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => PaymentMethodSchema), z.lazy(() => NestedEnumPaymentMethodNullableFilterSchema) ]).optional().nullable(),
});

export const DecimalNullableFilterSchema: z.ZodType<Prisma.DecimalNullableFilter> = z.strictObject({
  equals: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional().nullable(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional().nullable(),
  lt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalNullableFilterSchema) ]).optional().nullable(),
});

export const MemberScalarRelationFilterSchema: z.ZodType<Prisma.MemberScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => MemberWhereInputSchema).optional(),
  isNot: z.lazy(() => MemberWhereInputSchema).optional(),
});

export const MembershipPlanScalarRelationFilterSchema: z.ZodType<Prisma.MembershipPlanScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => MembershipPlanWhereInputSchema).optional(),
  isNot: z.lazy(() => MembershipPlanWhereInputSchema).optional(),
});

export const MembershipCountOrderByAggregateInputSchema: z.ZodType<Prisma.MembershipCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.lazy(() => SortOrderSchema).optional(),
  endDate: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  lastPaymentMethod: z.lazy(() => SortOrderSchema).optional(),
  lastPaymentDate: z.lazy(() => SortOrderSchema).optional(),
  lastPaymentAmount: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
  memberId: z.lazy(() => SortOrderSchema).optional(),
  membershipPlanId: z.lazy(() => SortOrderSchema).optional(),
});

export const MembershipAvgOrderByAggregateInputSchema: z.ZodType<Prisma.MembershipAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  lastPaymentAmount: z.lazy(() => SortOrderSchema).optional(),
  memberId: z.lazy(() => SortOrderSchema).optional(),
  membershipPlanId: z.lazy(() => SortOrderSchema).optional(),
});

export const MembershipMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MembershipMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.lazy(() => SortOrderSchema).optional(),
  endDate: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  lastPaymentMethod: z.lazy(() => SortOrderSchema).optional(),
  lastPaymentDate: z.lazy(() => SortOrderSchema).optional(),
  lastPaymentAmount: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
  memberId: z.lazy(() => SortOrderSchema).optional(),
  membershipPlanId: z.lazy(() => SortOrderSchema).optional(),
});

export const MembershipMinOrderByAggregateInputSchema: z.ZodType<Prisma.MembershipMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.lazy(() => SortOrderSchema).optional(),
  endDate: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  lastPaymentMethod: z.lazy(() => SortOrderSchema).optional(),
  lastPaymentDate: z.lazy(() => SortOrderSchema).optional(),
  lastPaymentAmount: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
  memberId: z.lazy(() => SortOrderSchema).optional(),
  membershipPlanId: z.lazy(() => SortOrderSchema).optional(),
});

export const MembershipSumOrderByAggregateInputSchema: z.ZodType<Prisma.MembershipSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  lastPaymentAmount: z.lazy(() => SortOrderSchema).optional(),
  memberId: z.lazy(() => SortOrderSchema).optional(),
  membershipPlanId: z.lazy(() => SortOrderSchema).optional(),
});

export const EnumMembershipStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumMembershipStatusWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => MembershipStatusSchema).optional(),
  in: z.lazy(() => MembershipStatusSchema).array().optional(),
  notIn: z.lazy(() => MembershipStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => MembershipStatusSchema), z.lazy(() => NestedEnumMembershipStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumMembershipStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumMembershipStatusFilterSchema).optional(),
});

export const EnumPaymentMethodNullableWithAggregatesFilterSchema: z.ZodType<Prisma.EnumPaymentMethodNullableWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  in: z.lazy(() => PaymentMethodSchema).array().optional().nullable(),
  notIn: z.lazy(() => PaymentMethodSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => PaymentMethodSchema), z.lazy(() => NestedEnumPaymentMethodNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPaymentMethodNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPaymentMethodNullableFilterSchema).optional(),
});

export const DecimalNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DecimalNullableWithAggregatesFilter> = z.strictObject({
  equals: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional().nullable(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional().nullable(),
  lt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedDecimalNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedDecimalNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDecimalNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDecimalNullableFilterSchema).optional(),
});

export const FloatFilterSchema: z.ZodType<Prisma.FloatFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
});

export const MembershipListRelationFilterSchema: z.ZodType<Prisma.MembershipListRelationFilter> = z.strictObject({
  every: z.lazy(() => MembershipWhereInputSchema).optional(),
  some: z.lazy(() => MembershipWhereInputSchema).optional(),
  none: z.lazy(() => MembershipWhereInputSchema).optional(),
});

export const MembershipOrderByRelationAggregateInputSchema: z.ZodType<Prisma.MembershipOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const MembershipPlanOrderByRelevanceInputSchema: z.ZodType<Prisma.MembershipPlanOrderByRelevanceInput> = z.strictObject({
  fields: z.union([ z.lazy(() => MembershipPlanOrderByRelevanceFieldEnumSchema), z.lazy(() => MembershipPlanOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string(),
});

export const MembershipPlanCountOrderByAggregateInputSchema: z.ZodType<Prisma.MembershipPlanCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  durationDays: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const MembershipPlanAvgOrderByAggregateInputSchema: z.ZodType<Prisma.MembershipPlanAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  durationDays: z.lazy(() => SortOrderSchema).optional(),
});

export const MembershipPlanMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MembershipPlanMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  durationDays: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const MembershipPlanMinOrderByAggregateInputSchema: z.ZodType<Prisma.MembershipPlanMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  durationDays: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const MembershipPlanSumOrderByAggregateInputSchema: z.ZodType<Prisma.MembershipPlanSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  durationDays: z.lazy(() => SortOrderSchema).optional(),
});

export const FloatWithAggregatesFilterSchema: z.ZodType<Prisma.FloatWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional(),
});

export const EnumClassCategoryFilterSchema: z.ZodType<Prisma.EnumClassCategoryFilter> = z.strictObject({
  equals: z.lazy(() => ClassCategorySchema).optional(),
  in: z.lazy(() => ClassCategorySchema).array().optional(),
  notIn: z.lazy(() => ClassCategorySchema).array().optional(),
  not: z.union([ z.lazy(() => ClassCategorySchema), z.lazy(() => NestedEnumClassCategoryFilterSchema) ]).optional(),
});

export const EnumDayOfWeekFilterSchema: z.ZodType<Prisma.EnumDayOfWeekFilter> = z.strictObject({
  equals: z.lazy(() => DayOfWeekSchema).optional(),
  in: z.lazy(() => DayOfWeekSchema).array().optional(),
  notIn: z.lazy(() => DayOfWeekSchema).array().optional(),
  not: z.union([ z.lazy(() => DayOfWeekSchema), z.lazy(() => NestedEnumDayOfWeekFilterSchema) ]).optional(),
});

export const InstructorScalarRelationFilterSchema: z.ZodType<Prisma.InstructorScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => InstructorWhereInputSchema).optional(),
  isNot: z.lazy(() => InstructorWhereInputSchema).optional(),
});

export const ClassSessionListRelationFilterSchema: z.ZodType<Prisma.ClassSessionListRelationFilter> = z.strictObject({
  every: z.lazy(() => ClassSessionWhereInputSchema).optional(),
  some: z.lazy(() => ClassSessionWhereInputSchema).optional(),
  none: z.lazy(() => ClassSessionWhereInputSchema).optional(),
});

export const ClassSessionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ClassSessionOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const ClassScheduleOrderByRelevanceInputSchema: z.ZodType<Prisma.ClassScheduleOrderByRelevanceInput> = z.strictObject({
  fields: z.union([ z.lazy(() => ClassScheduleOrderByRelevanceFieldEnumSchema), z.lazy(() => ClassScheduleOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string(),
});

export const ClassScheduleCountOrderByAggregateInputSchema: z.ZodType<Prisma.ClassScheduleCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  maxCapacity: z.lazy(() => SortOrderSchema).optional(),
  durationMinutes: z.lazy(() => SortOrderSchema).optional(),
  instructorId: z.lazy(() => SortOrderSchema).optional(),
  dayOfWeek: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const ClassScheduleAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ClassScheduleAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  maxCapacity: z.lazy(() => SortOrderSchema).optional(),
  durationMinutes: z.lazy(() => SortOrderSchema).optional(),
  instructorId: z.lazy(() => SortOrderSchema).optional(),
});

export const ClassScheduleMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ClassScheduleMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  maxCapacity: z.lazy(() => SortOrderSchema).optional(),
  durationMinutes: z.lazy(() => SortOrderSchema).optional(),
  instructorId: z.lazy(() => SortOrderSchema).optional(),
  dayOfWeek: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const ClassScheduleMinOrderByAggregateInputSchema: z.ZodType<Prisma.ClassScheduleMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  maxCapacity: z.lazy(() => SortOrderSchema).optional(),
  durationMinutes: z.lazy(() => SortOrderSchema).optional(),
  instructorId: z.lazy(() => SortOrderSchema).optional(),
  dayOfWeek: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const ClassScheduleSumOrderByAggregateInputSchema: z.ZodType<Prisma.ClassScheduleSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  maxCapacity: z.lazy(() => SortOrderSchema).optional(),
  durationMinutes: z.lazy(() => SortOrderSchema).optional(),
  instructorId: z.lazy(() => SortOrderSchema).optional(),
});

export const EnumClassCategoryWithAggregatesFilterSchema: z.ZodType<Prisma.EnumClassCategoryWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => ClassCategorySchema).optional(),
  in: z.lazy(() => ClassCategorySchema).array().optional(),
  notIn: z.lazy(() => ClassCategorySchema).array().optional(),
  not: z.union([ z.lazy(() => ClassCategorySchema), z.lazy(() => NestedEnumClassCategoryWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumClassCategoryFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumClassCategoryFilterSchema).optional(),
});

export const EnumDayOfWeekWithAggregatesFilterSchema: z.ZodType<Prisma.EnumDayOfWeekWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => DayOfWeekSchema).optional(),
  in: z.lazy(() => DayOfWeekSchema).array().optional(),
  notIn: z.lazy(() => DayOfWeekSchema).array().optional(),
  not: z.union([ z.lazy(() => DayOfWeekSchema), z.lazy(() => NestedEnumDayOfWeekWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDayOfWeekFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDayOfWeekFilterSchema).optional(),
});

export const EnumClassStatusFilterSchema: z.ZodType<Prisma.EnumClassStatusFilter> = z.strictObject({
  equals: z.lazy(() => ClassStatusSchema).optional(),
  in: z.lazy(() => ClassStatusSchema).array().optional(),
  notIn: z.lazy(() => ClassStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ClassStatusSchema), z.lazy(() => NestedEnumClassStatusFilterSchema) ]).optional(),
});

export const ClassScheduleScalarRelationFilterSchema: z.ZodType<Prisma.ClassScheduleScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => ClassScheduleWhereInputSchema).optional(),
  isNot: z.lazy(() => ClassScheduleWhereInputSchema).optional(),
});

export const ClassSessionClassScheduleIdDateStartTimeCompoundUniqueInputSchema: z.ZodType<Prisma.ClassSessionClassScheduleIdDateStartTimeCompoundUniqueInput> = z.strictObject({
  classScheduleId: z.number(),
  date: z.coerce.date(),
  startTime: z.coerce.date(),
});

export const ClassSessionCountOrderByAggregateInputSchema: z.ZodType<Prisma.ClassSessionCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  classScheduleId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional(),
  remainingCapacity: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const ClassSessionAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ClassSessionAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  classScheduleId: z.lazy(() => SortOrderSchema).optional(),
  remainingCapacity: z.lazy(() => SortOrderSchema).optional(),
});

export const ClassSessionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ClassSessionMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  classScheduleId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional(),
  remainingCapacity: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const ClassSessionMinOrderByAggregateInputSchema: z.ZodType<Prisma.ClassSessionMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  classScheduleId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional(),
  remainingCapacity: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const ClassSessionSumOrderByAggregateInputSchema: z.ZodType<Prisma.ClassSessionSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  classScheduleId: z.lazy(() => SortOrderSchema).optional(),
  remainingCapacity: z.lazy(() => SortOrderSchema).optional(),
});

export const EnumClassStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumClassStatusWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => ClassStatusSchema).optional(),
  in: z.lazy(() => ClassStatusSchema).array().optional(),
  notIn: z.lazy(() => ClassStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ClassStatusSchema), z.lazy(() => NestedEnumClassStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumClassStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumClassStatusFilterSchema).optional(),
});

export const EnumClassBookingStatusFilterSchema: z.ZodType<Prisma.EnumClassBookingStatusFilter> = z.strictObject({
  equals: z.lazy(() => ClassBookingStatusSchema).optional(),
  in: z.lazy(() => ClassBookingStatusSchema).array().optional(),
  notIn: z.lazy(() => ClassBookingStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ClassBookingStatusSchema), z.lazy(() => NestedEnumClassBookingStatusFilterSchema) ]).optional(),
});

export const ClassSessionScalarRelationFilterSchema: z.ZodType<Prisma.ClassSessionScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => ClassSessionWhereInputSchema).optional(),
  isNot: z.lazy(() => ClassSessionWhereInputSchema).optional(),
});

export const ClassBookingMemberIdClassSessionIdCompoundUniqueInputSchema: z.ZodType<Prisma.ClassBookingMemberIdClassSessionIdCompoundUniqueInput> = z.strictObject({
  memberId: z.number(),
  classSessionId: z.number(),
});

export const ClassBookingCountOrderByAggregateInputSchema: z.ZodType<Prisma.ClassBookingCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  memberId: z.lazy(() => SortOrderSchema).optional(),
  classSessionId: z.lazy(() => SortOrderSchema).optional(),
  bookingDate: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const ClassBookingAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ClassBookingAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  memberId: z.lazy(() => SortOrderSchema).optional(),
  classSessionId: z.lazy(() => SortOrderSchema).optional(),
});

export const ClassBookingMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ClassBookingMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  memberId: z.lazy(() => SortOrderSchema).optional(),
  classSessionId: z.lazy(() => SortOrderSchema).optional(),
  bookingDate: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const ClassBookingMinOrderByAggregateInputSchema: z.ZodType<Prisma.ClassBookingMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  memberId: z.lazy(() => SortOrderSchema).optional(),
  classSessionId: z.lazy(() => SortOrderSchema).optional(),
  bookingDate: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const ClassBookingSumOrderByAggregateInputSchema: z.ZodType<Prisma.ClassBookingSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  memberId: z.lazy(() => SortOrderSchema).optional(),
  classSessionId: z.lazy(() => SortOrderSchema).optional(),
});

export const EnumClassBookingStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumClassBookingStatusWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => ClassBookingStatusSchema).optional(),
  in: z.lazy(() => ClassBookingStatusSchema).array().optional(),
  notIn: z.lazy(() => ClassBookingStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ClassBookingStatusSchema), z.lazy(() => NestedEnumClassBookingStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumClassBookingStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumClassBookingStatusFilterSchema).optional(),
});

export const EnumDifficultyLevelExerciseFilterSchema: z.ZodType<Prisma.EnumDifficultyLevelExerciseFilter> = z.strictObject({
  equals: z.lazy(() => DifficultyLevelExerciseSchema).optional(),
  in: z.lazy(() => DifficultyLevelExerciseSchema).array().optional(),
  notIn: z.lazy(() => DifficultyLevelExerciseSchema).array().optional(),
  not: z.union([ z.lazy(() => DifficultyLevelExerciseSchema), z.lazy(() => NestedEnumDifficultyLevelExerciseFilterSchema) ]).optional(),
});

export const ExerciseOrderByRelevanceInputSchema: z.ZodType<Prisma.ExerciseOrderByRelevanceInput> = z.strictObject({
  fields: z.union([ z.lazy(() => ExerciseOrderByRelevanceFieldEnumSchema), z.lazy(() => ExerciseOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string(),
});

export const ExerciseCountOrderByAggregateInputSchema: z.ZodType<Prisma.ExerciseCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  muscleGroup: z.lazy(() => SortOrderSchema).optional(),
  difficultyLevel: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const ExerciseAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ExerciseAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
});

export const ExerciseMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ExerciseMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  muscleGroup: z.lazy(() => SortOrderSchema).optional(),
  difficultyLevel: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const ExerciseMinOrderByAggregateInputSchema: z.ZodType<Prisma.ExerciseMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  muscleGroup: z.lazy(() => SortOrderSchema).optional(),
  difficultyLevel: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const ExerciseSumOrderByAggregateInputSchema: z.ZodType<Prisma.ExerciseSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
});

export const EnumDifficultyLevelExerciseWithAggregatesFilterSchema: z.ZodType<Prisma.EnumDifficultyLevelExerciseWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => DifficultyLevelExerciseSchema).optional(),
  in: z.lazy(() => DifficultyLevelExerciseSchema).array().optional(),
  notIn: z.lazy(() => DifficultyLevelExerciseSchema).array().optional(),
  not: z.union([ z.lazy(() => DifficultyLevelExerciseSchema), z.lazy(() => NestedEnumDifficultyLevelExerciseWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDifficultyLevelExerciseFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDifficultyLevelExerciseFilterSchema).optional(),
});

export const MembershipCreateNestedOneWithoutMemberInputSchema: z.ZodType<Prisma.MembershipCreateNestedOneWithoutMemberInput> = z.strictObject({
  create: z.union([ z.lazy(() => MembershipCreateWithoutMemberInputSchema), z.lazy(() => MembershipUncheckedCreateWithoutMemberInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MembershipCreateOrConnectWithoutMemberInputSchema).optional(),
  connect: z.lazy(() => MembershipWhereUniqueInputSchema).optional(),
});

export const ClassBookingCreateNestedManyWithoutMemberInputSchema: z.ZodType<Prisma.ClassBookingCreateNestedManyWithoutMemberInput> = z.strictObject({
  create: z.union([ z.lazy(() => ClassBookingCreateWithoutMemberInputSchema), z.lazy(() => ClassBookingCreateWithoutMemberInputSchema).array(), z.lazy(() => ClassBookingUncheckedCreateWithoutMemberInputSchema), z.lazy(() => ClassBookingUncheckedCreateWithoutMemberInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClassBookingCreateOrConnectWithoutMemberInputSchema), z.lazy(() => ClassBookingCreateOrConnectWithoutMemberInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClassBookingCreateManyMemberInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClassBookingWhereUniqueInputSchema), z.lazy(() => ClassBookingWhereUniqueInputSchema).array() ]).optional(),
});

export const MembershipUncheckedCreateNestedOneWithoutMemberInputSchema: z.ZodType<Prisma.MembershipUncheckedCreateNestedOneWithoutMemberInput> = z.strictObject({
  create: z.union([ z.lazy(() => MembershipCreateWithoutMemberInputSchema), z.lazy(() => MembershipUncheckedCreateWithoutMemberInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MembershipCreateOrConnectWithoutMemberInputSchema).optional(),
  connect: z.lazy(() => MembershipWhereUniqueInputSchema).optional(),
});

export const ClassBookingUncheckedCreateNestedManyWithoutMemberInputSchema: z.ZodType<Prisma.ClassBookingUncheckedCreateNestedManyWithoutMemberInput> = z.strictObject({
  create: z.union([ z.lazy(() => ClassBookingCreateWithoutMemberInputSchema), z.lazy(() => ClassBookingCreateWithoutMemberInputSchema).array(), z.lazy(() => ClassBookingUncheckedCreateWithoutMemberInputSchema), z.lazy(() => ClassBookingUncheckedCreateWithoutMemberInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClassBookingCreateOrConnectWithoutMemberInputSchema), z.lazy(() => ClassBookingCreateOrConnectWithoutMemberInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClassBookingCreateManyMemberInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClassBookingWhereUniqueInputSchema), z.lazy(() => ClassBookingWhereUniqueInputSchema).array() ]).optional(),
});

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional(),
});

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional().nullable(),
});

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.strictObject({
  set: z.coerce.date().optional(),
});

export const EnumStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumStatusFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => StatusSchema).optional(),
});

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.strictObject({
  set: z.coerce.date().optional().nullable(),
});

export const MembershipUpdateOneWithoutMemberNestedInputSchema: z.ZodType<Prisma.MembershipUpdateOneWithoutMemberNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MembershipCreateWithoutMemberInputSchema), z.lazy(() => MembershipUncheckedCreateWithoutMemberInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MembershipCreateOrConnectWithoutMemberInputSchema).optional(),
  upsert: z.lazy(() => MembershipUpsertWithoutMemberInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => MembershipWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => MembershipWhereInputSchema) ]).optional(),
  connect: z.lazy(() => MembershipWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MembershipUpdateToOneWithWhereWithoutMemberInputSchema), z.lazy(() => MembershipUpdateWithoutMemberInputSchema), z.lazy(() => MembershipUncheckedUpdateWithoutMemberInputSchema) ]).optional(),
});

export const ClassBookingUpdateManyWithoutMemberNestedInputSchema: z.ZodType<Prisma.ClassBookingUpdateManyWithoutMemberNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ClassBookingCreateWithoutMemberInputSchema), z.lazy(() => ClassBookingCreateWithoutMemberInputSchema).array(), z.lazy(() => ClassBookingUncheckedCreateWithoutMemberInputSchema), z.lazy(() => ClassBookingUncheckedCreateWithoutMemberInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClassBookingCreateOrConnectWithoutMemberInputSchema), z.lazy(() => ClassBookingCreateOrConnectWithoutMemberInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClassBookingUpsertWithWhereUniqueWithoutMemberInputSchema), z.lazy(() => ClassBookingUpsertWithWhereUniqueWithoutMemberInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClassBookingCreateManyMemberInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClassBookingWhereUniqueInputSchema), z.lazy(() => ClassBookingWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClassBookingWhereUniqueInputSchema), z.lazy(() => ClassBookingWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClassBookingWhereUniqueInputSchema), z.lazy(() => ClassBookingWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClassBookingWhereUniqueInputSchema), z.lazy(() => ClassBookingWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClassBookingUpdateWithWhereUniqueWithoutMemberInputSchema), z.lazy(() => ClassBookingUpdateWithWhereUniqueWithoutMemberInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClassBookingUpdateManyWithWhereWithoutMemberInputSchema), z.lazy(() => ClassBookingUpdateManyWithWhereWithoutMemberInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClassBookingScalarWhereInputSchema), z.lazy(() => ClassBookingScalarWhereInputSchema).array() ]).optional(),
});

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const MembershipUncheckedUpdateOneWithoutMemberNestedInputSchema: z.ZodType<Prisma.MembershipUncheckedUpdateOneWithoutMemberNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MembershipCreateWithoutMemberInputSchema), z.lazy(() => MembershipUncheckedCreateWithoutMemberInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MembershipCreateOrConnectWithoutMemberInputSchema).optional(),
  upsert: z.lazy(() => MembershipUpsertWithoutMemberInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => MembershipWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => MembershipWhereInputSchema) ]).optional(),
  connect: z.lazy(() => MembershipWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MembershipUpdateToOneWithWhereWithoutMemberInputSchema), z.lazy(() => MembershipUpdateWithoutMemberInputSchema), z.lazy(() => MembershipUncheckedUpdateWithoutMemberInputSchema) ]).optional(),
});

export const ClassBookingUncheckedUpdateManyWithoutMemberNestedInputSchema: z.ZodType<Prisma.ClassBookingUncheckedUpdateManyWithoutMemberNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ClassBookingCreateWithoutMemberInputSchema), z.lazy(() => ClassBookingCreateWithoutMemberInputSchema).array(), z.lazy(() => ClassBookingUncheckedCreateWithoutMemberInputSchema), z.lazy(() => ClassBookingUncheckedCreateWithoutMemberInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClassBookingCreateOrConnectWithoutMemberInputSchema), z.lazy(() => ClassBookingCreateOrConnectWithoutMemberInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClassBookingUpsertWithWhereUniqueWithoutMemberInputSchema), z.lazy(() => ClassBookingUpsertWithWhereUniqueWithoutMemberInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClassBookingCreateManyMemberInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClassBookingWhereUniqueInputSchema), z.lazy(() => ClassBookingWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClassBookingWhereUniqueInputSchema), z.lazy(() => ClassBookingWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClassBookingWhereUniqueInputSchema), z.lazy(() => ClassBookingWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClassBookingWhereUniqueInputSchema), z.lazy(() => ClassBookingWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClassBookingUpdateWithWhereUniqueWithoutMemberInputSchema), z.lazy(() => ClassBookingUpdateWithWhereUniqueWithoutMemberInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClassBookingUpdateManyWithWhereWithoutMemberInputSchema), z.lazy(() => ClassBookingUpdateManyWithWhereWithoutMemberInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClassBookingScalarWhereInputSchema), z.lazy(() => ClassBookingScalarWhereInputSchema).array() ]).optional(),
});

export const ClassScheduleCreateNestedManyWithoutInstructorInputSchema: z.ZodType<Prisma.ClassScheduleCreateNestedManyWithoutInstructorInput> = z.strictObject({
  create: z.union([ z.lazy(() => ClassScheduleCreateWithoutInstructorInputSchema), z.lazy(() => ClassScheduleCreateWithoutInstructorInputSchema).array(), z.lazy(() => ClassScheduleUncheckedCreateWithoutInstructorInputSchema), z.lazy(() => ClassScheduleUncheckedCreateWithoutInstructorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClassScheduleCreateOrConnectWithoutInstructorInputSchema), z.lazy(() => ClassScheduleCreateOrConnectWithoutInstructorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClassScheduleCreateManyInstructorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClassScheduleWhereUniqueInputSchema), z.lazy(() => ClassScheduleWhereUniqueInputSchema).array() ]).optional(),
});

export const ClassScheduleUncheckedCreateNestedManyWithoutInstructorInputSchema: z.ZodType<Prisma.ClassScheduleUncheckedCreateNestedManyWithoutInstructorInput> = z.strictObject({
  create: z.union([ z.lazy(() => ClassScheduleCreateWithoutInstructorInputSchema), z.lazy(() => ClassScheduleCreateWithoutInstructorInputSchema).array(), z.lazy(() => ClassScheduleUncheckedCreateWithoutInstructorInputSchema), z.lazy(() => ClassScheduleUncheckedCreateWithoutInstructorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClassScheduleCreateOrConnectWithoutInstructorInputSchema), z.lazy(() => ClassScheduleCreateOrConnectWithoutInstructorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClassScheduleCreateManyInstructorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClassScheduleWhereUniqueInputSchema), z.lazy(() => ClassScheduleWhereUniqueInputSchema).array() ]).optional(),
});

export const ClassScheduleUpdateManyWithoutInstructorNestedInputSchema: z.ZodType<Prisma.ClassScheduleUpdateManyWithoutInstructorNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ClassScheduleCreateWithoutInstructorInputSchema), z.lazy(() => ClassScheduleCreateWithoutInstructorInputSchema).array(), z.lazy(() => ClassScheduleUncheckedCreateWithoutInstructorInputSchema), z.lazy(() => ClassScheduleUncheckedCreateWithoutInstructorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClassScheduleCreateOrConnectWithoutInstructorInputSchema), z.lazy(() => ClassScheduleCreateOrConnectWithoutInstructorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClassScheduleUpsertWithWhereUniqueWithoutInstructorInputSchema), z.lazy(() => ClassScheduleUpsertWithWhereUniqueWithoutInstructorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClassScheduleCreateManyInstructorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClassScheduleWhereUniqueInputSchema), z.lazy(() => ClassScheduleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClassScheduleWhereUniqueInputSchema), z.lazy(() => ClassScheduleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClassScheduleWhereUniqueInputSchema), z.lazy(() => ClassScheduleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClassScheduleWhereUniqueInputSchema), z.lazy(() => ClassScheduleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClassScheduleUpdateWithWhereUniqueWithoutInstructorInputSchema), z.lazy(() => ClassScheduleUpdateWithWhereUniqueWithoutInstructorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClassScheduleUpdateManyWithWhereWithoutInstructorInputSchema), z.lazy(() => ClassScheduleUpdateManyWithWhereWithoutInstructorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClassScheduleScalarWhereInputSchema), z.lazy(() => ClassScheduleScalarWhereInputSchema).array() ]).optional(),
});

export const ClassScheduleUncheckedUpdateManyWithoutInstructorNestedInputSchema: z.ZodType<Prisma.ClassScheduleUncheckedUpdateManyWithoutInstructorNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ClassScheduleCreateWithoutInstructorInputSchema), z.lazy(() => ClassScheduleCreateWithoutInstructorInputSchema).array(), z.lazy(() => ClassScheduleUncheckedCreateWithoutInstructorInputSchema), z.lazy(() => ClassScheduleUncheckedCreateWithoutInstructorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClassScheduleCreateOrConnectWithoutInstructorInputSchema), z.lazy(() => ClassScheduleCreateOrConnectWithoutInstructorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClassScheduleUpsertWithWhereUniqueWithoutInstructorInputSchema), z.lazy(() => ClassScheduleUpsertWithWhereUniqueWithoutInstructorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClassScheduleCreateManyInstructorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClassScheduleWhereUniqueInputSchema), z.lazy(() => ClassScheduleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClassScheduleWhereUniqueInputSchema), z.lazy(() => ClassScheduleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClassScheduleWhereUniqueInputSchema), z.lazy(() => ClassScheduleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClassScheduleWhereUniqueInputSchema), z.lazy(() => ClassScheduleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClassScheduleUpdateWithWhereUniqueWithoutInstructorInputSchema), z.lazy(() => ClassScheduleUpdateWithWhereUniqueWithoutInstructorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClassScheduleUpdateManyWithWhereWithoutInstructorInputSchema), z.lazy(() => ClassScheduleUpdateManyWithWhereWithoutInstructorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClassScheduleScalarWhereInputSchema), z.lazy(() => ClassScheduleScalarWhereInputSchema).array() ]).optional(),
});

export const MemberCreateNestedOneWithoutMembershipInputSchema: z.ZodType<Prisma.MemberCreateNestedOneWithoutMembershipInput> = z.strictObject({
  create: z.union([ z.lazy(() => MemberCreateWithoutMembershipInputSchema), z.lazy(() => MemberUncheckedCreateWithoutMembershipInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MemberCreateOrConnectWithoutMembershipInputSchema).optional(),
  connect: z.lazy(() => MemberWhereUniqueInputSchema).optional(),
});

export const MembershipPlanCreateNestedOneWithoutMembershipsInputSchema: z.ZodType<Prisma.MembershipPlanCreateNestedOneWithoutMembershipsInput> = z.strictObject({
  create: z.union([ z.lazy(() => MembershipPlanCreateWithoutMembershipsInputSchema), z.lazy(() => MembershipPlanUncheckedCreateWithoutMembershipsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MembershipPlanCreateOrConnectWithoutMembershipsInputSchema).optional(),
  connect: z.lazy(() => MembershipPlanWhereUniqueInputSchema).optional(),
});

export const EnumMembershipStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumMembershipStatusFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => MembershipStatusSchema).optional(),
});

export const NullableEnumPaymentMethodFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumPaymentMethodFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => PaymentMethodSchema).optional().nullable(),
});

export const NullableDecimalFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDecimalFieldUpdateOperationsInput> = z.strictObject({
  set: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  increment: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  decrement: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  multiply: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  divide: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
});

export const MemberUpdateOneRequiredWithoutMembershipNestedInputSchema: z.ZodType<Prisma.MemberUpdateOneRequiredWithoutMembershipNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MemberCreateWithoutMembershipInputSchema), z.lazy(() => MemberUncheckedCreateWithoutMembershipInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MemberCreateOrConnectWithoutMembershipInputSchema).optional(),
  upsert: z.lazy(() => MemberUpsertWithoutMembershipInputSchema).optional(),
  connect: z.lazy(() => MemberWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MemberUpdateToOneWithWhereWithoutMembershipInputSchema), z.lazy(() => MemberUpdateWithoutMembershipInputSchema), z.lazy(() => MemberUncheckedUpdateWithoutMembershipInputSchema) ]).optional(),
});

export const MembershipPlanUpdateOneRequiredWithoutMembershipsNestedInputSchema: z.ZodType<Prisma.MembershipPlanUpdateOneRequiredWithoutMembershipsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MembershipPlanCreateWithoutMembershipsInputSchema), z.lazy(() => MembershipPlanUncheckedCreateWithoutMembershipsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MembershipPlanCreateOrConnectWithoutMembershipsInputSchema).optional(),
  upsert: z.lazy(() => MembershipPlanUpsertWithoutMembershipsInputSchema).optional(),
  connect: z.lazy(() => MembershipPlanWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MembershipPlanUpdateToOneWithWhereWithoutMembershipsInputSchema), z.lazy(() => MembershipPlanUpdateWithoutMembershipsInputSchema), z.lazy(() => MembershipPlanUncheckedUpdateWithoutMembershipsInputSchema) ]).optional(),
});

export const MembershipCreateNestedManyWithoutMembershipPlanInputSchema: z.ZodType<Prisma.MembershipCreateNestedManyWithoutMembershipPlanInput> = z.strictObject({
  create: z.union([ z.lazy(() => MembershipCreateWithoutMembershipPlanInputSchema), z.lazy(() => MembershipCreateWithoutMembershipPlanInputSchema).array(), z.lazy(() => MembershipUncheckedCreateWithoutMembershipPlanInputSchema), z.lazy(() => MembershipUncheckedCreateWithoutMembershipPlanInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MembershipCreateOrConnectWithoutMembershipPlanInputSchema), z.lazy(() => MembershipCreateOrConnectWithoutMembershipPlanInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MembershipCreateManyMembershipPlanInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema), z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
});

export const MembershipUncheckedCreateNestedManyWithoutMembershipPlanInputSchema: z.ZodType<Prisma.MembershipUncheckedCreateNestedManyWithoutMembershipPlanInput> = z.strictObject({
  create: z.union([ z.lazy(() => MembershipCreateWithoutMembershipPlanInputSchema), z.lazy(() => MembershipCreateWithoutMembershipPlanInputSchema).array(), z.lazy(() => MembershipUncheckedCreateWithoutMembershipPlanInputSchema), z.lazy(() => MembershipUncheckedCreateWithoutMembershipPlanInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MembershipCreateOrConnectWithoutMembershipPlanInputSchema), z.lazy(() => MembershipCreateOrConnectWithoutMembershipPlanInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MembershipCreateManyMembershipPlanInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema), z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
});

export const FloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.FloatFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const MembershipUpdateManyWithoutMembershipPlanNestedInputSchema: z.ZodType<Prisma.MembershipUpdateManyWithoutMembershipPlanNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MembershipCreateWithoutMembershipPlanInputSchema), z.lazy(() => MembershipCreateWithoutMembershipPlanInputSchema).array(), z.lazy(() => MembershipUncheckedCreateWithoutMembershipPlanInputSchema), z.lazy(() => MembershipUncheckedCreateWithoutMembershipPlanInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MembershipCreateOrConnectWithoutMembershipPlanInputSchema), z.lazy(() => MembershipCreateOrConnectWithoutMembershipPlanInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MembershipUpsertWithWhereUniqueWithoutMembershipPlanInputSchema), z.lazy(() => MembershipUpsertWithWhereUniqueWithoutMembershipPlanInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MembershipCreateManyMembershipPlanInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema), z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema), z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema), z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema), z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MembershipUpdateWithWhereUniqueWithoutMembershipPlanInputSchema), z.lazy(() => MembershipUpdateWithWhereUniqueWithoutMembershipPlanInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MembershipUpdateManyWithWhereWithoutMembershipPlanInputSchema), z.lazy(() => MembershipUpdateManyWithWhereWithoutMembershipPlanInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MembershipScalarWhereInputSchema), z.lazy(() => MembershipScalarWhereInputSchema).array() ]).optional(),
});

export const MembershipUncheckedUpdateManyWithoutMembershipPlanNestedInputSchema: z.ZodType<Prisma.MembershipUncheckedUpdateManyWithoutMembershipPlanNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MembershipCreateWithoutMembershipPlanInputSchema), z.lazy(() => MembershipCreateWithoutMembershipPlanInputSchema).array(), z.lazy(() => MembershipUncheckedCreateWithoutMembershipPlanInputSchema), z.lazy(() => MembershipUncheckedCreateWithoutMembershipPlanInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MembershipCreateOrConnectWithoutMembershipPlanInputSchema), z.lazy(() => MembershipCreateOrConnectWithoutMembershipPlanInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MembershipUpsertWithWhereUniqueWithoutMembershipPlanInputSchema), z.lazy(() => MembershipUpsertWithWhereUniqueWithoutMembershipPlanInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MembershipCreateManyMembershipPlanInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema), z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema), z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema), z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema), z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MembershipUpdateWithWhereUniqueWithoutMembershipPlanInputSchema), z.lazy(() => MembershipUpdateWithWhereUniqueWithoutMembershipPlanInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MembershipUpdateManyWithWhereWithoutMembershipPlanInputSchema), z.lazy(() => MembershipUpdateManyWithWhereWithoutMembershipPlanInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MembershipScalarWhereInputSchema), z.lazy(() => MembershipScalarWhereInputSchema).array() ]).optional(),
});

export const InstructorCreateNestedOneWithoutClassSchedulesInputSchema: z.ZodType<Prisma.InstructorCreateNestedOneWithoutClassSchedulesInput> = z.strictObject({
  create: z.union([ z.lazy(() => InstructorCreateWithoutClassSchedulesInputSchema), z.lazy(() => InstructorUncheckedCreateWithoutClassSchedulesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => InstructorCreateOrConnectWithoutClassSchedulesInputSchema).optional(),
  connect: z.lazy(() => InstructorWhereUniqueInputSchema).optional(),
});

export const ClassSessionCreateNestedManyWithoutClassScheduleInputSchema: z.ZodType<Prisma.ClassSessionCreateNestedManyWithoutClassScheduleInput> = z.strictObject({
  create: z.union([ z.lazy(() => ClassSessionCreateWithoutClassScheduleInputSchema), z.lazy(() => ClassSessionCreateWithoutClassScheduleInputSchema).array(), z.lazy(() => ClassSessionUncheckedCreateWithoutClassScheduleInputSchema), z.lazy(() => ClassSessionUncheckedCreateWithoutClassScheduleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClassSessionCreateOrConnectWithoutClassScheduleInputSchema), z.lazy(() => ClassSessionCreateOrConnectWithoutClassScheduleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClassSessionCreateManyClassScheduleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClassSessionWhereUniqueInputSchema), z.lazy(() => ClassSessionWhereUniqueInputSchema).array() ]).optional(),
});

export const ClassSessionUncheckedCreateNestedManyWithoutClassScheduleInputSchema: z.ZodType<Prisma.ClassSessionUncheckedCreateNestedManyWithoutClassScheduleInput> = z.strictObject({
  create: z.union([ z.lazy(() => ClassSessionCreateWithoutClassScheduleInputSchema), z.lazy(() => ClassSessionCreateWithoutClassScheduleInputSchema).array(), z.lazy(() => ClassSessionUncheckedCreateWithoutClassScheduleInputSchema), z.lazy(() => ClassSessionUncheckedCreateWithoutClassScheduleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClassSessionCreateOrConnectWithoutClassScheduleInputSchema), z.lazy(() => ClassSessionCreateOrConnectWithoutClassScheduleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClassSessionCreateManyClassScheduleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClassSessionWhereUniqueInputSchema), z.lazy(() => ClassSessionWhereUniqueInputSchema).array() ]).optional(),
});

export const EnumClassCategoryFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumClassCategoryFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => ClassCategorySchema).optional(),
});

export const EnumDayOfWeekFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumDayOfWeekFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => DayOfWeekSchema).optional(),
});

export const InstructorUpdateOneRequiredWithoutClassSchedulesNestedInputSchema: z.ZodType<Prisma.InstructorUpdateOneRequiredWithoutClassSchedulesNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => InstructorCreateWithoutClassSchedulesInputSchema), z.lazy(() => InstructorUncheckedCreateWithoutClassSchedulesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => InstructorCreateOrConnectWithoutClassSchedulesInputSchema).optional(),
  upsert: z.lazy(() => InstructorUpsertWithoutClassSchedulesInputSchema).optional(),
  connect: z.lazy(() => InstructorWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => InstructorUpdateToOneWithWhereWithoutClassSchedulesInputSchema), z.lazy(() => InstructorUpdateWithoutClassSchedulesInputSchema), z.lazy(() => InstructorUncheckedUpdateWithoutClassSchedulesInputSchema) ]).optional(),
});

export const ClassSessionUpdateManyWithoutClassScheduleNestedInputSchema: z.ZodType<Prisma.ClassSessionUpdateManyWithoutClassScheduleNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ClassSessionCreateWithoutClassScheduleInputSchema), z.lazy(() => ClassSessionCreateWithoutClassScheduleInputSchema).array(), z.lazy(() => ClassSessionUncheckedCreateWithoutClassScheduleInputSchema), z.lazy(() => ClassSessionUncheckedCreateWithoutClassScheduleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClassSessionCreateOrConnectWithoutClassScheduleInputSchema), z.lazy(() => ClassSessionCreateOrConnectWithoutClassScheduleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClassSessionUpsertWithWhereUniqueWithoutClassScheduleInputSchema), z.lazy(() => ClassSessionUpsertWithWhereUniqueWithoutClassScheduleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClassSessionCreateManyClassScheduleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClassSessionWhereUniqueInputSchema), z.lazy(() => ClassSessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClassSessionWhereUniqueInputSchema), z.lazy(() => ClassSessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClassSessionWhereUniqueInputSchema), z.lazy(() => ClassSessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClassSessionWhereUniqueInputSchema), z.lazy(() => ClassSessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClassSessionUpdateWithWhereUniqueWithoutClassScheduleInputSchema), z.lazy(() => ClassSessionUpdateWithWhereUniqueWithoutClassScheduleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClassSessionUpdateManyWithWhereWithoutClassScheduleInputSchema), z.lazy(() => ClassSessionUpdateManyWithWhereWithoutClassScheduleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClassSessionScalarWhereInputSchema), z.lazy(() => ClassSessionScalarWhereInputSchema).array() ]).optional(),
});

export const ClassSessionUncheckedUpdateManyWithoutClassScheduleNestedInputSchema: z.ZodType<Prisma.ClassSessionUncheckedUpdateManyWithoutClassScheduleNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ClassSessionCreateWithoutClassScheduleInputSchema), z.lazy(() => ClassSessionCreateWithoutClassScheduleInputSchema).array(), z.lazy(() => ClassSessionUncheckedCreateWithoutClassScheduleInputSchema), z.lazy(() => ClassSessionUncheckedCreateWithoutClassScheduleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClassSessionCreateOrConnectWithoutClassScheduleInputSchema), z.lazy(() => ClassSessionCreateOrConnectWithoutClassScheduleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClassSessionUpsertWithWhereUniqueWithoutClassScheduleInputSchema), z.lazy(() => ClassSessionUpsertWithWhereUniqueWithoutClassScheduleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClassSessionCreateManyClassScheduleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClassSessionWhereUniqueInputSchema), z.lazy(() => ClassSessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClassSessionWhereUniqueInputSchema), z.lazy(() => ClassSessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClassSessionWhereUniqueInputSchema), z.lazy(() => ClassSessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClassSessionWhereUniqueInputSchema), z.lazy(() => ClassSessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClassSessionUpdateWithWhereUniqueWithoutClassScheduleInputSchema), z.lazy(() => ClassSessionUpdateWithWhereUniqueWithoutClassScheduleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClassSessionUpdateManyWithWhereWithoutClassScheduleInputSchema), z.lazy(() => ClassSessionUpdateManyWithWhereWithoutClassScheduleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClassSessionScalarWhereInputSchema), z.lazy(() => ClassSessionScalarWhereInputSchema).array() ]).optional(),
});

export const ClassScheduleCreateNestedOneWithoutSessionsInputSchema: z.ZodType<Prisma.ClassScheduleCreateNestedOneWithoutSessionsInput> = z.strictObject({
  create: z.union([ z.lazy(() => ClassScheduleCreateWithoutSessionsInputSchema), z.lazy(() => ClassScheduleUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ClassScheduleCreateOrConnectWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => ClassScheduleWhereUniqueInputSchema).optional(),
});

export const ClassBookingCreateNestedManyWithoutClassSessionInputSchema: z.ZodType<Prisma.ClassBookingCreateNestedManyWithoutClassSessionInput> = z.strictObject({
  create: z.union([ z.lazy(() => ClassBookingCreateWithoutClassSessionInputSchema), z.lazy(() => ClassBookingCreateWithoutClassSessionInputSchema).array(), z.lazy(() => ClassBookingUncheckedCreateWithoutClassSessionInputSchema), z.lazy(() => ClassBookingUncheckedCreateWithoutClassSessionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClassBookingCreateOrConnectWithoutClassSessionInputSchema), z.lazy(() => ClassBookingCreateOrConnectWithoutClassSessionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClassBookingCreateManyClassSessionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClassBookingWhereUniqueInputSchema), z.lazy(() => ClassBookingWhereUniqueInputSchema).array() ]).optional(),
});

export const ClassBookingUncheckedCreateNestedManyWithoutClassSessionInputSchema: z.ZodType<Prisma.ClassBookingUncheckedCreateNestedManyWithoutClassSessionInput> = z.strictObject({
  create: z.union([ z.lazy(() => ClassBookingCreateWithoutClassSessionInputSchema), z.lazy(() => ClassBookingCreateWithoutClassSessionInputSchema).array(), z.lazy(() => ClassBookingUncheckedCreateWithoutClassSessionInputSchema), z.lazy(() => ClassBookingUncheckedCreateWithoutClassSessionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClassBookingCreateOrConnectWithoutClassSessionInputSchema), z.lazy(() => ClassBookingCreateOrConnectWithoutClassSessionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClassBookingCreateManyClassSessionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClassBookingWhereUniqueInputSchema), z.lazy(() => ClassBookingWhereUniqueInputSchema).array() ]).optional(),
});

export const EnumClassStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumClassStatusFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => ClassStatusSchema).optional(),
});

export const ClassScheduleUpdateOneRequiredWithoutSessionsNestedInputSchema: z.ZodType<Prisma.ClassScheduleUpdateOneRequiredWithoutSessionsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ClassScheduleCreateWithoutSessionsInputSchema), z.lazy(() => ClassScheduleUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ClassScheduleCreateOrConnectWithoutSessionsInputSchema).optional(),
  upsert: z.lazy(() => ClassScheduleUpsertWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => ClassScheduleWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ClassScheduleUpdateToOneWithWhereWithoutSessionsInputSchema), z.lazy(() => ClassScheduleUpdateWithoutSessionsInputSchema), z.lazy(() => ClassScheduleUncheckedUpdateWithoutSessionsInputSchema) ]).optional(),
});

export const ClassBookingUpdateManyWithoutClassSessionNestedInputSchema: z.ZodType<Prisma.ClassBookingUpdateManyWithoutClassSessionNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ClassBookingCreateWithoutClassSessionInputSchema), z.lazy(() => ClassBookingCreateWithoutClassSessionInputSchema).array(), z.lazy(() => ClassBookingUncheckedCreateWithoutClassSessionInputSchema), z.lazy(() => ClassBookingUncheckedCreateWithoutClassSessionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClassBookingCreateOrConnectWithoutClassSessionInputSchema), z.lazy(() => ClassBookingCreateOrConnectWithoutClassSessionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClassBookingUpsertWithWhereUniqueWithoutClassSessionInputSchema), z.lazy(() => ClassBookingUpsertWithWhereUniqueWithoutClassSessionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClassBookingCreateManyClassSessionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClassBookingWhereUniqueInputSchema), z.lazy(() => ClassBookingWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClassBookingWhereUniqueInputSchema), z.lazy(() => ClassBookingWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClassBookingWhereUniqueInputSchema), z.lazy(() => ClassBookingWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClassBookingWhereUniqueInputSchema), z.lazy(() => ClassBookingWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClassBookingUpdateWithWhereUniqueWithoutClassSessionInputSchema), z.lazy(() => ClassBookingUpdateWithWhereUniqueWithoutClassSessionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClassBookingUpdateManyWithWhereWithoutClassSessionInputSchema), z.lazy(() => ClassBookingUpdateManyWithWhereWithoutClassSessionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClassBookingScalarWhereInputSchema), z.lazy(() => ClassBookingScalarWhereInputSchema).array() ]).optional(),
});

export const ClassBookingUncheckedUpdateManyWithoutClassSessionNestedInputSchema: z.ZodType<Prisma.ClassBookingUncheckedUpdateManyWithoutClassSessionNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ClassBookingCreateWithoutClassSessionInputSchema), z.lazy(() => ClassBookingCreateWithoutClassSessionInputSchema).array(), z.lazy(() => ClassBookingUncheckedCreateWithoutClassSessionInputSchema), z.lazy(() => ClassBookingUncheckedCreateWithoutClassSessionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClassBookingCreateOrConnectWithoutClassSessionInputSchema), z.lazy(() => ClassBookingCreateOrConnectWithoutClassSessionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClassBookingUpsertWithWhereUniqueWithoutClassSessionInputSchema), z.lazy(() => ClassBookingUpsertWithWhereUniqueWithoutClassSessionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClassBookingCreateManyClassSessionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClassBookingWhereUniqueInputSchema), z.lazy(() => ClassBookingWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClassBookingWhereUniqueInputSchema), z.lazy(() => ClassBookingWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClassBookingWhereUniqueInputSchema), z.lazy(() => ClassBookingWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClassBookingWhereUniqueInputSchema), z.lazy(() => ClassBookingWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClassBookingUpdateWithWhereUniqueWithoutClassSessionInputSchema), z.lazy(() => ClassBookingUpdateWithWhereUniqueWithoutClassSessionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClassBookingUpdateManyWithWhereWithoutClassSessionInputSchema), z.lazy(() => ClassBookingUpdateManyWithWhereWithoutClassSessionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClassBookingScalarWhereInputSchema), z.lazy(() => ClassBookingScalarWhereInputSchema).array() ]).optional(),
});

export const MemberCreateNestedOneWithoutClassBookingsInputSchema: z.ZodType<Prisma.MemberCreateNestedOneWithoutClassBookingsInput> = z.strictObject({
  create: z.union([ z.lazy(() => MemberCreateWithoutClassBookingsInputSchema), z.lazy(() => MemberUncheckedCreateWithoutClassBookingsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MemberCreateOrConnectWithoutClassBookingsInputSchema).optional(),
  connect: z.lazy(() => MemberWhereUniqueInputSchema).optional(),
});

export const ClassSessionCreateNestedOneWithoutBookingsInputSchema: z.ZodType<Prisma.ClassSessionCreateNestedOneWithoutBookingsInput> = z.strictObject({
  create: z.union([ z.lazy(() => ClassSessionCreateWithoutBookingsInputSchema), z.lazy(() => ClassSessionUncheckedCreateWithoutBookingsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ClassSessionCreateOrConnectWithoutBookingsInputSchema).optional(),
  connect: z.lazy(() => ClassSessionWhereUniqueInputSchema).optional(),
});

export const EnumClassBookingStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumClassBookingStatusFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => ClassBookingStatusSchema).optional(),
});

export const MemberUpdateOneRequiredWithoutClassBookingsNestedInputSchema: z.ZodType<Prisma.MemberUpdateOneRequiredWithoutClassBookingsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MemberCreateWithoutClassBookingsInputSchema), z.lazy(() => MemberUncheckedCreateWithoutClassBookingsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MemberCreateOrConnectWithoutClassBookingsInputSchema).optional(),
  upsert: z.lazy(() => MemberUpsertWithoutClassBookingsInputSchema).optional(),
  connect: z.lazy(() => MemberWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MemberUpdateToOneWithWhereWithoutClassBookingsInputSchema), z.lazy(() => MemberUpdateWithoutClassBookingsInputSchema), z.lazy(() => MemberUncheckedUpdateWithoutClassBookingsInputSchema) ]).optional(),
});

export const ClassSessionUpdateOneRequiredWithoutBookingsNestedInputSchema: z.ZodType<Prisma.ClassSessionUpdateOneRequiredWithoutBookingsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ClassSessionCreateWithoutBookingsInputSchema), z.lazy(() => ClassSessionUncheckedCreateWithoutBookingsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ClassSessionCreateOrConnectWithoutBookingsInputSchema).optional(),
  upsert: z.lazy(() => ClassSessionUpsertWithoutBookingsInputSchema).optional(),
  connect: z.lazy(() => ClassSessionWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ClassSessionUpdateToOneWithWhereWithoutBookingsInputSchema), z.lazy(() => ClassSessionUpdateWithoutBookingsInputSchema), z.lazy(() => ClassSessionUncheckedUpdateWithoutBookingsInputSchema) ]).optional(),
});

export const EnumDifficultyLevelExerciseFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumDifficultyLevelExerciseFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => DifficultyLevelExerciseSchema).optional(),
});

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
});

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
});

export const NestedEnumStatusFilterSchema: z.ZodType<Prisma.NestedEnumStatusFilter> = z.strictObject({
  equals: z.lazy(() => StatusSchema).optional(),
  in: z.lazy(() => StatusSchema).array().optional(),
  notIn: z.lazy(() => StatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StatusSchema), z.lazy(() => NestedEnumStatusFilterSchema) ]).optional(),
});

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
});

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
});

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
});

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
});

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
});

export const NestedEnumStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumStatusWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => StatusSchema).optional(),
  in: z.lazy(() => StatusSchema).array().optional(),
  notIn: z.lazy(() => StatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StatusSchema), z.lazy(() => NestedEnumStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumStatusFilterSchema).optional(),
});

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
});

export const NestedEnumMembershipStatusFilterSchema: z.ZodType<Prisma.NestedEnumMembershipStatusFilter> = z.strictObject({
  equals: z.lazy(() => MembershipStatusSchema).optional(),
  in: z.lazy(() => MembershipStatusSchema).array().optional(),
  notIn: z.lazy(() => MembershipStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => MembershipStatusSchema), z.lazy(() => NestedEnumMembershipStatusFilterSchema) ]).optional(),
});

export const NestedEnumPaymentMethodNullableFilterSchema: z.ZodType<Prisma.NestedEnumPaymentMethodNullableFilter> = z.strictObject({
  equals: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  in: z.lazy(() => PaymentMethodSchema).array().optional().nullable(),
  notIn: z.lazy(() => PaymentMethodSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => PaymentMethodSchema), z.lazy(() => NestedEnumPaymentMethodNullableFilterSchema) ]).optional().nullable(),
});

export const NestedDecimalNullableFilterSchema: z.ZodType<Prisma.NestedDecimalNullableFilter> = z.strictObject({
  equals: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional().nullable(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional().nullable(),
  lt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalNullableFilterSchema) ]).optional().nullable(),
});

export const NestedEnumMembershipStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumMembershipStatusWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => MembershipStatusSchema).optional(),
  in: z.lazy(() => MembershipStatusSchema).array().optional(),
  notIn: z.lazy(() => MembershipStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => MembershipStatusSchema), z.lazy(() => NestedEnumMembershipStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumMembershipStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumMembershipStatusFilterSchema).optional(),
});

export const NestedEnumPaymentMethodNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumPaymentMethodNullableWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  in: z.lazy(() => PaymentMethodSchema).array().optional().nullable(),
  notIn: z.lazy(() => PaymentMethodSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => PaymentMethodSchema), z.lazy(() => NestedEnumPaymentMethodNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPaymentMethodNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPaymentMethodNullableFilterSchema).optional(),
});

export const NestedDecimalNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDecimalNullableWithAggregatesFilter> = z.strictObject({
  equals: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional().nullable(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional().nullable(),
  lt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedDecimalNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedDecimalNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDecimalNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDecimalNullableFilterSchema).optional(),
});

export const NestedFloatWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional(),
});

export const NestedEnumClassCategoryFilterSchema: z.ZodType<Prisma.NestedEnumClassCategoryFilter> = z.strictObject({
  equals: z.lazy(() => ClassCategorySchema).optional(),
  in: z.lazy(() => ClassCategorySchema).array().optional(),
  notIn: z.lazy(() => ClassCategorySchema).array().optional(),
  not: z.union([ z.lazy(() => ClassCategorySchema), z.lazy(() => NestedEnumClassCategoryFilterSchema) ]).optional(),
});

export const NestedEnumDayOfWeekFilterSchema: z.ZodType<Prisma.NestedEnumDayOfWeekFilter> = z.strictObject({
  equals: z.lazy(() => DayOfWeekSchema).optional(),
  in: z.lazy(() => DayOfWeekSchema).array().optional(),
  notIn: z.lazy(() => DayOfWeekSchema).array().optional(),
  not: z.union([ z.lazy(() => DayOfWeekSchema), z.lazy(() => NestedEnumDayOfWeekFilterSchema) ]).optional(),
});

export const NestedEnumClassCategoryWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumClassCategoryWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => ClassCategorySchema).optional(),
  in: z.lazy(() => ClassCategorySchema).array().optional(),
  notIn: z.lazy(() => ClassCategorySchema).array().optional(),
  not: z.union([ z.lazy(() => ClassCategorySchema), z.lazy(() => NestedEnumClassCategoryWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumClassCategoryFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumClassCategoryFilterSchema).optional(),
});

export const NestedEnumDayOfWeekWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumDayOfWeekWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => DayOfWeekSchema).optional(),
  in: z.lazy(() => DayOfWeekSchema).array().optional(),
  notIn: z.lazy(() => DayOfWeekSchema).array().optional(),
  not: z.union([ z.lazy(() => DayOfWeekSchema), z.lazy(() => NestedEnumDayOfWeekWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDayOfWeekFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDayOfWeekFilterSchema).optional(),
});

export const NestedEnumClassStatusFilterSchema: z.ZodType<Prisma.NestedEnumClassStatusFilter> = z.strictObject({
  equals: z.lazy(() => ClassStatusSchema).optional(),
  in: z.lazy(() => ClassStatusSchema).array().optional(),
  notIn: z.lazy(() => ClassStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ClassStatusSchema), z.lazy(() => NestedEnumClassStatusFilterSchema) ]).optional(),
});

export const NestedEnumClassStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumClassStatusWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => ClassStatusSchema).optional(),
  in: z.lazy(() => ClassStatusSchema).array().optional(),
  notIn: z.lazy(() => ClassStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ClassStatusSchema), z.lazy(() => NestedEnumClassStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumClassStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumClassStatusFilterSchema).optional(),
});

export const NestedEnumClassBookingStatusFilterSchema: z.ZodType<Prisma.NestedEnumClassBookingStatusFilter> = z.strictObject({
  equals: z.lazy(() => ClassBookingStatusSchema).optional(),
  in: z.lazy(() => ClassBookingStatusSchema).array().optional(),
  notIn: z.lazy(() => ClassBookingStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ClassBookingStatusSchema), z.lazy(() => NestedEnumClassBookingStatusFilterSchema) ]).optional(),
});

export const NestedEnumClassBookingStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumClassBookingStatusWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => ClassBookingStatusSchema).optional(),
  in: z.lazy(() => ClassBookingStatusSchema).array().optional(),
  notIn: z.lazy(() => ClassBookingStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ClassBookingStatusSchema), z.lazy(() => NestedEnumClassBookingStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumClassBookingStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumClassBookingStatusFilterSchema).optional(),
});

export const NestedEnumDifficultyLevelExerciseFilterSchema: z.ZodType<Prisma.NestedEnumDifficultyLevelExerciseFilter> = z.strictObject({
  equals: z.lazy(() => DifficultyLevelExerciseSchema).optional(),
  in: z.lazy(() => DifficultyLevelExerciseSchema).array().optional(),
  notIn: z.lazy(() => DifficultyLevelExerciseSchema).array().optional(),
  not: z.union([ z.lazy(() => DifficultyLevelExerciseSchema), z.lazy(() => NestedEnumDifficultyLevelExerciseFilterSchema) ]).optional(),
});

export const NestedEnumDifficultyLevelExerciseWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumDifficultyLevelExerciseWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => DifficultyLevelExerciseSchema).optional(),
  in: z.lazy(() => DifficultyLevelExerciseSchema).array().optional(),
  notIn: z.lazy(() => DifficultyLevelExerciseSchema).array().optional(),
  not: z.union([ z.lazy(() => DifficultyLevelExerciseSchema), z.lazy(() => NestedEnumDifficultyLevelExerciseWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDifficultyLevelExerciseFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDifficultyLevelExerciseFilterSchema).optional(),
});

export const MembershipCreateWithoutMemberInputSchema: z.ZodType<Prisma.MembershipCreateWithoutMemberInput> = z.strictObject({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date(),
  status: z.lazy(() => MembershipStatusSchema).optional(),
  lastPaymentMethod: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  lastPaymentDate: z.coerce.date().optional().nullable(),
  lastPaymentAmount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  membershipPlan: z.lazy(() => MembershipPlanCreateNestedOneWithoutMembershipsInputSchema),
});

export const MembershipUncheckedCreateWithoutMemberInputSchema: z.ZodType<Prisma.MembershipUncheckedCreateWithoutMemberInput> = z.strictObject({
  id: z.number().int().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date(),
  status: z.lazy(() => MembershipStatusSchema).optional(),
  lastPaymentMethod: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  lastPaymentDate: z.coerce.date().optional().nullable(),
  lastPaymentAmount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  membershipPlanId: z.number().int(),
});

export const MembershipCreateOrConnectWithoutMemberInputSchema: z.ZodType<Prisma.MembershipCreateOrConnectWithoutMemberInput> = z.strictObject({
  where: z.lazy(() => MembershipWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MembershipCreateWithoutMemberInputSchema), z.lazy(() => MembershipUncheckedCreateWithoutMemberInputSchema) ]),
});

export const ClassBookingCreateWithoutMemberInputSchema: z.ZodType<Prisma.ClassBookingCreateWithoutMemberInput> = z.strictObject({
  bookingDate: z.coerce.date().optional(),
  status: z.lazy(() => ClassBookingStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  classSession: z.lazy(() => ClassSessionCreateNestedOneWithoutBookingsInputSchema),
});

export const ClassBookingUncheckedCreateWithoutMemberInputSchema: z.ZodType<Prisma.ClassBookingUncheckedCreateWithoutMemberInput> = z.strictObject({
  id: z.number().int().optional(),
  classSessionId: z.number().int(),
  bookingDate: z.coerce.date().optional(),
  status: z.lazy(() => ClassBookingStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
});

export const ClassBookingCreateOrConnectWithoutMemberInputSchema: z.ZodType<Prisma.ClassBookingCreateOrConnectWithoutMemberInput> = z.strictObject({
  where: z.lazy(() => ClassBookingWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ClassBookingCreateWithoutMemberInputSchema), z.lazy(() => ClassBookingUncheckedCreateWithoutMemberInputSchema) ]),
});

export const ClassBookingCreateManyMemberInputEnvelopeSchema: z.ZodType<Prisma.ClassBookingCreateManyMemberInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => ClassBookingCreateManyMemberInputSchema), z.lazy(() => ClassBookingCreateManyMemberInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const MembershipUpsertWithoutMemberInputSchema: z.ZodType<Prisma.MembershipUpsertWithoutMemberInput> = z.strictObject({
  update: z.union([ z.lazy(() => MembershipUpdateWithoutMemberInputSchema), z.lazy(() => MembershipUncheckedUpdateWithoutMemberInputSchema) ]),
  create: z.union([ z.lazy(() => MembershipCreateWithoutMemberInputSchema), z.lazy(() => MembershipUncheckedCreateWithoutMemberInputSchema) ]),
  where: z.lazy(() => MembershipWhereInputSchema).optional(),
});

export const MembershipUpdateToOneWithWhereWithoutMemberInputSchema: z.ZodType<Prisma.MembershipUpdateToOneWithWhereWithoutMemberInput> = z.strictObject({
  where: z.lazy(() => MembershipWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => MembershipUpdateWithoutMemberInputSchema), z.lazy(() => MembershipUncheckedUpdateWithoutMemberInputSchema) ]),
});

export const MembershipUpdateWithoutMemberInputSchema: z.ZodType<Prisma.MembershipUpdateWithoutMemberInput> = z.strictObject({
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => MembershipStatusSchema), z.lazy(() => EnumMembershipStatusFieldUpdateOperationsInputSchema) ]).optional(),
  lastPaymentMethod: z.union([ z.lazy(() => PaymentMethodSchema), z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastPaymentDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastPaymentAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  membershipPlan: z.lazy(() => MembershipPlanUpdateOneRequiredWithoutMembershipsNestedInputSchema).optional(),
});

export const MembershipUncheckedUpdateWithoutMemberInputSchema: z.ZodType<Prisma.MembershipUncheckedUpdateWithoutMemberInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => MembershipStatusSchema), z.lazy(() => EnumMembershipStatusFieldUpdateOperationsInputSchema) ]).optional(),
  lastPaymentMethod: z.union([ z.lazy(() => PaymentMethodSchema), z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastPaymentDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastPaymentAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  membershipPlanId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ClassBookingUpsertWithWhereUniqueWithoutMemberInputSchema: z.ZodType<Prisma.ClassBookingUpsertWithWhereUniqueWithoutMemberInput> = z.strictObject({
  where: z.lazy(() => ClassBookingWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ClassBookingUpdateWithoutMemberInputSchema), z.lazy(() => ClassBookingUncheckedUpdateWithoutMemberInputSchema) ]),
  create: z.union([ z.lazy(() => ClassBookingCreateWithoutMemberInputSchema), z.lazy(() => ClassBookingUncheckedCreateWithoutMemberInputSchema) ]),
});

export const ClassBookingUpdateWithWhereUniqueWithoutMemberInputSchema: z.ZodType<Prisma.ClassBookingUpdateWithWhereUniqueWithoutMemberInput> = z.strictObject({
  where: z.lazy(() => ClassBookingWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ClassBookingUpdateWithoutMemberInputSchema), z.lazy(() => ClassBookingUncheckedUpdateWithoutMemberInputSchema) ]),
});

export const ClassBookingUpdateManyWithWhereWithoutMemberInputSchema: z.ZodType<Prisma.ClassBookingUpdateManyWithWhereWithoutMemberInput> = z.strictObject({
  where: z.lazy(() => ClassBookingScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ClassBookingUpdateManyMutationInputSchema), z.lazy(() => ClassBookingUncheckedUpdateManyWithoutMemberInputSchema) ]),
});

export const ClassBookingScalarWhereInputSchema: z.ZodType<Prisma.ClassBookingScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ClassBookingScalarWhereInputSchema), z.lazy(() => ClassBookingScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClassBookingScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClassBookingScalarWhereInputSchema), z.lazy(() => ClassBookingScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  memberId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  classSessionId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  bookingDate: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  status: z.union([ z.lazy(() => EnumClassBookingStatusFilterSchema), z.lazy(() => ClassBookingStatusSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
});

export const ClassScheduleCreateWithoutInstructorInputSchema: z.ZodType<Prisma.ClassScheduleCreateWithoutInstructorInput> = z.strictObject({
  name: z.string(),
  description: z.string().optional().nullable(),
  category: z.lazy(() => ClassCategorySchema),
  maxCapacity: z.number().int(),
  durationMinutes: z.number().int(),
  dayOfWeek: z.lazy(() => DayOfWeekSchema),
  startTime: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  sessions: z.lazy(() => ClassSessionCreateNestedManyWithoutClassScheduleInputSchema).optional(),
});

export const ClassScheduleUncheckedCreateWithoutInstructorInputSchema: z.ZodType<Prisma.ClassScheduleUncheckedCreateWithoutInstructorInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  category: z.lazy(() => ClassCategorySchema),
  maxCapacity: z.number().int(),
  durationMinutes: z.number().int(),
  dayOfWeek: z.lazy(() => DayOfWeekSchema),
  startTime: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  sessions: z.lazy(() => ClassSessionUncheckedCreateNestedManyWithoutClassScheduleInputSchema).optional(),
});

export const ClassScheduleCreateOrConnectWithoutInstructorInputSchema: z.ZodType<Prisma.ClassScheduleCreateOrConnectWithoutInstructorInput> = z.strictObject({
  where: z.lazy(() => ClassScheduleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ClassScheduleCreateWithoutInstructorInputSchema), z.lazy(() => ClassScheduleUncheckedCreateWithoutInstructorInputSchema) ]),
});

export const ClassScheduleCreateManyInstructorInputEnvelopeSchema: z.ZodType<Prisma.ClassScheduleCreateManyInstructorInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => ClassScheduleCreateManyInstructorInputSchema), z.lazy(() => ClassScheduleCreateManyInstructorInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const ClassScheduleUpsertWithWhereUniqueWithoutInstructorInputSchema: z.ZodType<Prisma.ClassScheduleUpsertWithWhereUniqueWithoutInstructorInput> = z.strictObject({
  where: z.lazy(() => ClassScheduleWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ClassScheduleUpdateWithoutInstructorInputSchema), z.lazy(() => ClassScheduleUncheckedUpdateWithoutInstructorInputSchema) ]),
  create: z.union([ z.lazy(() => ClassScheduleCreateWithoutInstructorInputSchema), z.lazy(() => ClassScheduleUncheckedCreateWithoutInstructorInputSchema) ]),
});

export const ClassScheduleUpdateWithWhereUniqueWithoutInstructorInputSchema: z.ZodType<Prisma.ClassScheduleUpdateWithWhereUniqueWithoutInstructorInput> = z.strictObject({
  where: z.lazy(() => ClassScheduleWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ClassScheduleUpdateWithoutInstructorInputSchema), z.lazy(() => ClassScheduleUncheckedUpdateWithoutInstructorInputSchema) ]),
});

export const ClassScheduleUpdateManyWithWhereWithoutInstructorInputSchema: z.ZodType<Prisma.ClassScheduleUpdateManyWithWhereWithoutInstructorInput> = z.strictObject({
  where: z.lazy(() => ClassScheduleScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ClassScheduleUpdateManyMutationInputSchema), z.lazy(() => ClassScheduleUncheckedUpdateManyWithoutInstructorInputSchema) ]),
});

export const ClassScheduleScalarWhereInputSchema: z.ZodType<Prisma.ClassScheduleScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ClassScheduleScalarWhereInputSchema), z.lazy(() => ClassScheduleScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClassScheduleScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClassScheduleScalarWhereInputSchema), z.lazy(() => ClassScheduleScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  category: z.union([ z.lazy(() => EnumClassCategoryFilterSchema), z.lazy(() => ClassCategorySchema) ]).optional(),
  maxCapacity: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  durationMinutes: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  instructorId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  dayOfWeek: z.union([ z.lazy(() => EnumDayOfWeekFilterSchema), z.lazy(() => DayOfWeekSchema) ]).optional(),
  startTime: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
});

export const MemberCreateWithoutMembershipInputSchema: z.ZodType<Prisma.MemberCreateWithoutMembershipInput> = z.strictObject({
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  phone: z.string().optional().nullable(),
  joinDate: z.coerce.date().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  classBookings: z.lazy(() => ClassBookingCreateNestedManyWithoutMemberInputSchema).optional(),
});

export const MemberUncheckedCreateWithoutMembershipInputSchema: z.ZodType<Prisma.MemberUncheckedCreateWithoutMembershipInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  phone: z.string().optional().nullable(),
  joinDate: z.coerce.date().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  classBookings: z.lazy(() => ClassBookingUncheckedCreateNestedManyWithoutMemberInputSchema).optional(),
});

export const MemberCreateOrConnectWithoutMembershipInputSchema: z.ZodType<Prisma.MemberCreateOrConnectWithoutMembershipInput> = z.strictObject({
  where: z.lazy(() => MemberWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MemberCreateWithoutMembershipInputSchema), z.lazy(() => MemberUncheckedCreateWithoutMembershipInputSchema) ]),
});

export const MembershipPlanCreateWithoutMembershipsInputSchema: z.ZodType<Prisma.MembershipPlanCreateWithoutMembershipsInput> = z.strictObject({
  name: z.string(),
  description: z.string().optional().nullable(),
  price: z.number(),
  durationDays: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
});

export const MembershipPlanUncheckedCreateWithoutMembershipsInputSchema: z.ZodType<Prisma.MembershipPlanUncheckedCreateWithoutMembershipsInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  price: z.number(),
  durationDays: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
});

export const MembershipPlanCreateOrConnectWithoutMembershipsInputSchema: z.ZodType<Prisma.MembershipPlanCreateOrConnectWithoutMembershipsInput> = z.strictObject({
  where: z.lazy(() => MembershipPlanWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MembershipPlanCreateWithoutMembershipsInputSchema), z.lazy(() => MembershipPlanUncheckedCreateWithoutMembershipsInputSchema) ]),
});

export const MemberUpsertWithoutMembershipInputSchema: z.ZodType<Prisma.MemberUpsertWithoutMembershipInput> = z.strictObject({
  update: z.union([ z.lazy(() => MemberUpdateWithoutMembershipInputSchema), z.lazy(() => MemberUncheckedUpdateWithoutMembershipInputSchema) ]),
  create: z.union([ z.lazy(() => MemberCreateWithoutMembershipInputSchema), z.lazy(() => MemberUncheckedCreateWithoutMembershipInputSchema) ]),
  where: z.lazy(() => MemberWhereInputSchema).optional(),
});

export const MemberUpdateToOneWithWhereWithoutMembershipInputSchema: z.ZodType<Prisma.MemberUpdateToOneWithWhereWithoutMembershipInput> = z.strictObject({
  where: z.lazy(() => MemberWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => MemberUpdateWithoutMembershipInputSchema), z.lazy(() => MemberUncheckedUpdateWithoutMembershipInputSchema) ]),
});

export const MemberUpdateWithoutMembershipInputSchema: z.ZodType<Prisma.MemberUpdateWithoutMembershipInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  surname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joinDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema), z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  classBookings: z.lazy(() => ClassBookingUpdateManyWithoutMemberNestedInputSchema).optional(),
});

export const MemberUncheckedUpdateWithoutMembershipInputSchema: z.ZodType<Prisma.MemberUncheckedUpdateWithoutMembershipInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  surname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joinDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema), z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  classBookings: z.lazy(() => ClassBookingUncheckedUpdateManyWithoutMemberNestedInputSchema).optional(),
});

export const MembershipPlanUpsertWithoutMembershipsInputSchema: z.ZodType<Prisma.MembershipPlanUpsertWithoutMembershipsInput> = z.strictObject({
  update: z.union([ z.lazy(() => MembershipPlanUpdateWithoutMembershipsInputSchema), z.lazy(() => MembershipPlanUncheckedUpdateWithoutMembershipsInputSchema) ]),
  create: z.union([ z.lazy(() => MembershipPlanCreateWithoutMembershipsInputSchema), z.lazy(() => MembershipPlanUncheckedCreateWithoutMembershipsInputSchema) ]),
  where: z.lazy(() => MembershipPlanWhereInputSchema).optional(),
});

export const MembershipPlanUpdateToOneWithWhereWithoutMembershipsInputSchema: z.ZodType<Prisma.MembershipPlanUpdateToOneWithWhereWithoutMembershipsInput> = z.strictObject({
  where: z.lazy(() => MembershipPlanWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => MembershipPlanUpdateWithoutMembershipsInputSchema), z.lazy(() => MembershipPlanUncheckedUpdateWithoutMembershipsInputSchema) ]),
});

export const MembershipPlanUpdateWithoutMembershipsInputSchema: z.ZodType<Prisma.MembershipPlanUpdateWithoutMembershipsInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  durationDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const MembershipPlanUncheckedUpdateWithoutMembershipsInputSchema: z.ZodType<Prisma.MembershipPlanUncheckedUpdateWithoutMembershipsInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  durationDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const MembershipCreateWithoutMembershipPlanInputSchema: z.ZodType<Prisma.MembershipCreateWithoutMembershipPlanInput> = z.strictObject({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date(),
  status: z.lazy(() => MembershipStatusSchema).optional(),
  lastPaymentMethod: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  lastPaymentDate: z.coerce.date().optional().nullable(),
  lastPaymentAmount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  member: z.lazy(() => MemberCreateNestedOneWithoutMembershipInputSchema),
});

export const MembershipUncheckedCreateWithoutMembershipPlanInputSchema: z.ZodType<Prisma.MembershipUncheckedCreateWithoutMembershipPlanInput> = z.strictObject({
  id: z.number().int().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date(),
  status: z.lazy(() => MembershipStatusSchema).optional(),
  lastPaymentMethod: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  lastPaymentDate: z.coerce.date().optional().nullable(),
  lastPaymentAmount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  memberId: z.number().int(),
});

export const MembershipCreateOrConnectWithoutMembershipPlanInputSchema: z.ZodType<Prisma.MembershipCreateOrConnectWithoutMembershipPlanInput> = z.strictObject({
  where: z.lazy(() => MembershipWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MembershipCreateWithoutMembershipPlanInputSchema), z.lazy(() => MembershipUncheckedCreateWithoutMembershipPlanInputSchema) ]),
});

export const MembershipCreateManyMembershipPlanInputEnvelopeSchema: z.ZodType<Prisma.MembershipCreateManyMembershipPlanInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => MembershipCreateManyMembershipPlanInputSchema), z.lazy(() => MembershipCreateManyMembershipPlanInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const MembershipUpsertWithWhereUniqueWithoutMembershipPlanInputSchema: z.ZodType<Prisma.MembershipUpsertWithWhereUniqueWithoutMembershipPlanInput> = z.strictObject({
  where: z.lazy(() => MembershipWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MembershipUpdateWithoutMembershipPlanInputSchema), z.lazy(() => MembershipUncheckedUpdateWithoutMembershipPlanInputSchema) ]),
  create: z.union([ z.lazy(() => MembershipCreateWithoutMembershipPlanInputSchema), z.lazy(() => MembershipUncheckedCreateWithoutMembershipPlanInputSchema) ]),
});

export const MembershipUpdateWithWhereUniqueWithoutMembershipPlanInputSchema: z.ZodType<Prisma.MembershipUpdateWithWhereUniqueWithoutMembershipPlanInput> = z.strictObject({
  where: z.lazy(() => MembershipWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MembershipUpdateWithoutMembershipPlanInputSchema), z.lazy(() => MembershipUncheckedUpdateWithoutMembershipPlanInputSchema) ]),
});

export const MembershipUpdateManyWithWhereWithoutMembershipPlanInputSchema: z.ZodType<Prisma.MembershipUpdateManyWithWhereWithoutMembershipPlanInput> = z.strictObject({
  where: z.lazy(() => MembershipScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MembershipUpdateManyMutationInputSchema), z.lazy(() => MembershipUncheckedUpdateManyWithoutMembershipPlanInputSchema) ]),
});

export const MembershipScalarWhereInputSchema: z.ZodType<Prisma.MembershipScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MembershipScalarWhereInputSchema), z.lazy(() => MembershipScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MembershipScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MembershipScalarWhereInputSchema), z.lazy(() => MembershipScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  startDate: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  endDate: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  status: z.union([ z.lazy(() => EnumMembershipStatusFilterSchema), z.lazy(() => MembershipStatusSchema) ]).optional(),
  lastPaymentMethod: z.union([ z.lazy(() => EnumPaymentMethodNullableFilterSchema), z.lazy(() => PaymentMethodSchema) ]).optional().nullable(),
  lastPaymentDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  lastPaymentAmount: z.union([ z.lazy(() => DecimalNullableFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  memberId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  membershipPlanId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
});

export const InstructorCreateWithoutClassSchedulesInputSchema: z.ZodType<Prisma.InstructorCreateWithoutClassSchedulesInput> = z.strictObject({
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  phone: z.string().optional().nullable(),
  joinDate: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
});

export const InstructorUncheckedCreateWithoutClassSchedulesInputSchema: z.ZodType<Prisma.InstructorUncheckedCreateWithoutClassSchedulesInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  phone: z.string().optional().nullable(),
  joinDate: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
});

export const InstructorCreateOrConnectWithoutClassSchedulesInputSchema: z.ZodType<Prisma.InstructorCreateOrConnectWithoutClassSchedulesInput> = z.strictObject({
  where: z.lazy(() => InstructorWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => InstructorCreateWithoutClassSchedulesInputSchema), z.lazy(() => InstructorUncheckedCreateWithoutClassSchedulesInputSchema) ]),
});

export const ClassSessionCreateWithoutClassScheduleInputSchema: z.ZodType<Prisma.ClassSessionCreateWithoutClassScheduleInput> = z.strictObject({
  date: z.coerce.date(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  remainingCapacity: z.number().int(),
  status: z.lazy(() => ClassStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  bookings: z.lazy(() => ClassBookingCreateNestedManyWithoutClassSessionInputSchema).optional(),
});

export const ClassSessionUncheckedCreateWithoutClassScheduleInputSchema: z.ZodType<Prisma.ClassSessionUncheckedCreateWithoutClassScheduleInput> = z.strictObject({
  id: z.number().int().optional(),
  date: z.coerce.date(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  remainingCapacity: z.number().int(),
  status: z.lazy(() => ClassStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  bookings: z.lazy(() => ClassBookingUncheckedCreateNestedManyWithoutClassSessionInputSchema).optional(),
});

export const ClassSessionCreateOrConnectWithoutClassScheduleInputSchema: z.ZodType<Prisma.ClassSessionCreateOrConnectWithoutClassScheduleInput> = z.strictObject({
  where: z.lazy(() => ClassSessionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ClassSessionCreateWithoutClassScheduleInputSchema), z.lazy(() => ClassSessionUncheckedCreateWithoutClassScheduleInputSchema) ]),
});

export const ClassSessionCreateManyClassScheduleInputEnvelopeSchema: z.ZodType<Prisma.ClassSessionCreateManyClassScheduleInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => ClassSessionCreateManyClassScheduleInputSchema), z.lazy(() => ClassSessionCreateManyClassScheduleInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const InstructorUpsertWithoutClassSchedulesInputSchema: z.ZodType<Prisma.InstructorUpsertWithoutClassSchedulesInput> = z.strictObject({
  update: z.union([ z.lazy(() => InstructorUpdateWithoutClassSchedulesInputSchema), z.lazy(() => InstructorUncheckedUpdateWithoutClassSchedulesInputSchema) ]),
  create: z.union([ z.lazy(() => InstructorCreateWithoutClassSchedulesInputSchema), z.lazy(() => InstructorUncheckedCreateWithoutClassSchedulesInputSchema) ]),
  where: z.lazy(() => InstructorWhereInputSchema).optional(),
});

export const InstructorUpdateToOneWithWhereWithoutClassSchedulesInputSchema: z.ZodType<Prisma.InstructorUpdateToOneWithWhereWithoutClassSchedulesInput> = z.strictObject({
  where: z.lazy(() => InstructorWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => InstructorUpdateWithoutClassSchedulesInputSchema), z.lazy(() => InstructorUncheckedUpdateWithoutClassSchedulesInputSchema) ]),
});

export const InstructorUpdateWithoutClassSchedulesInputSchema: z.ZodType<Prisma.InstructorUpdateWithoutClassSchedulesInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  surname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joinDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const InstructorUncheckedUpdateWithoutClassSchedulesInputSchema: z.ZodType<Prisma.InstructorUncheckedUpdateWithoutClassSchedulesInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  surname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joinDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ClassSessionUpsertWithWhereUniqueWithoutClassScheduleInputSchema: z.ZodType<Prisma.ClassSessionUpsertWithWhereUniqueWithoutClassScheduleInput> = z.strictObject({
  where: z.lazy(() => ClassSessionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ClassSessionUpdateWithoutClassScheduleInputSchema), z.lazy(() => ClassSessionUncheckedUpdateWithoutClassScheduleInputSchema) ]),
  create: z.union([ z.lazy(() => ClassSessionCreateWithoutClassScheduleInputSchema), z.lazy(() => ClassSessionUncheckedCreateWithoutClassScheduleInputSchema) ]),
});

export const ClassSessionUpdateWithWhereUniqueWithoutClassScheduleInputSchema: z.ZodType<Prisma.ClassSessionUpdateWithWhereUniqueWithoutClassScheduleInput> = z.strictObject({
  where: z.lazy(() => ClassSessionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ClassSessionUpdateWithoutClassScheduleInputSchema), z.lazy(() => ClassSessionUncheckedUpdateWithoutClassScheduleInputSchema) ]),
});

export const ClassSessionUpdateManyWithWhereWithoutClassScheduleInputSchema: z.ZodType<Prisma.ClassSessionUpdateManyWithWhereWithoutClassScheduleInput> = z.strictObject({
  where: z.lazy(() => ClassSessionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ClassSessionUpdateManyMutationInputSchema), z.lazy(() => ClassSessionUncheckedUpdateManyWithoutClassScheduleInputSchema) ]),
});

export const ClassSessionScalarWhereInputSchema: z.ZodType<Prisma.ClassSessionScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ClassSessionScalarWhereInputSchema), z.lazy(() => ClassSessionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClassSessionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClassSessionScalarWhereInputSchema), z.lazy(() => ClassSessionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  classScheduleId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  startTime: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  endTime: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  remainingCapacity: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  status: z.union([ z.lazy(() => EnumClassStatusFilterSchema), z.lazy(() => ClassStatusSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
});

export const ClassScheduleCreateWithoutSessionsInputSchema: z.ZodType<Prisma.ClassScheduleCreateWithoutSessionsInput> = z.strictObject({
  name: z.string(),
  description: z.string().optional().nullable(),
  category: z.lazy(() => ClassCategorySchema),
  maxCapacity: z.number().int(),
  durationMinutes: z.number().int(),
  dayOfWeek: z.lazy(() => DayOfWeekSchema),
  startTime: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  instructor: z.lazy(() => InstructorCreateNestedOneWithoutClassSchedulesInputSchema),
});

export const ClassScheduleUncheckedCreateWithoutSessionsInputSchema: z.ZodType<Prisma.ClassScheduleUncheckedCreateWithoutSessionsInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  category: z.lazy(() => ClassCategorySchema),
  maxCapacity: z.number().int(),
  durationMinutes: z.number().int(),
  instructorId: z.number().int(),
  dayOfWeek: z.lazy(() => DayOfWeekSchema),
  startTime: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
});

export const ClassScheduleCreateOrConnectWithoutSessionsInputSchema: z.ZodType<Prisma.ClassScheduleCreateOrConnectWithoutSessionsInput> = z.strictObject({
  where: z.lazy(() => ClassScheduleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ClassScheduleCreateWithoutSessionsInputSchema), z.lazy(() => ClassScheduleUncheckedCreateWithoutSessionsInputSchema) ]),
});

export const ClassBookingCreateWithoutClassSessionInputSchema: z.ZodType<Prisma.ClassBookingCreateWithoutClassSessionInput> = z.strictObject({
  bookingDate: z.coerce.date().optional(),
  status: z.lazy(() => ClassBookingStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  member: z.lazy(() => MemberCreateNestedOneWithoutClassBookingsInputSchema),
});

export const ClassBookingUncheckedCreateWithoutClassSessionInputSchema: z.ZodType<Prisma.ClassBookingUncheckedCreateWithoutClassSessionInput> = z.strictObject({
  id: z.number().int().optional(),
  memberId: z.number().int(),
  bookingDate: z.coerce.date().optional(),
  status: z.lazy(() => ClassBookingStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
});

export const ClassBookingCreateOrConnectWithoutClassSessionInputSchema: z.ZodType<Prisma.ClassBookingCreateOrConnectWithoutClassSessionInput> = z.strictObject({
  where: z.lazy(() => ClassBookingWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ClassBookingCreateWithoutClassSessionInputSchema), z.lazy(() => ClassBookingUncheckedCreateWithoutClassSessionInputSchema) ]),
});

export const ClassBookingCreateManyClassSessionInputEnvelopeSchema: z.ZodType<Prisma.ClassBookingCreateManyClassSessionInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => ClassBookingCreateManyClassSessionInputSchema), z.lazy(() => ClassBookingCreateManyClassSessionInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const ClassScheduleUpsertWithoutSessionsInputSchema: z.ZodType<Prisma.ClassScheduleUpsertWithoutSessionsInput> = z.strictObject({
  update: z.union([ z.lazy(() => ClassScheduleUpdateWithoutSessionsInputSchema), z.lazy(() => ClassScheduleUncheckedUpdateWithoutSessionsInputSchema) ]),
  create: z.union([ z.lazy(() => ClassScheduleCreateWithoutSessionsInputSchema), z.lazy(() => ClassScheduleUncheckedCreateWithoutSessionsInputSchema) ]),
  where: z.lazy(() => ClassScheduleWhereInputSchema).optional(),
});

export const ClassScheduleUpdateToOneWithWhereWithoutSessionsInputSchema: z.ZodType<Prisma.ClassScheduleUpdateToOneWithWhereWithoutSessionsInput> = z.strictObject({
  where: z.lazy(() => ClassScheduleWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ClassScheduleUpdateWithoutSessionsInputSchema), z.lazy(() => ClassScheduleUncheckedUpdateWithoutSessionsInputSchema) ]),
});

export const ClassScheduleUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.ClassScheduleUpdateWithoutSessionsInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => ClassCategorySchema), z.lazy(() => EnumClassCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  maxCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  durationMinutes: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dayOfWeek: z.union([ z.lazy(() => DayOfWeekSchema), z.lazy(() => EnumDayOfWeekFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  instructor: z.lazy(() => InstructorUpdateOneRequiredWithoutClassSchedulesNestedInputSchema).optional(),
});

export const ClassScheduleUncheckedUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.ClassScheduleUncheckedUpdateWithoutSessionsInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => ClassCategorySchema), z.lazy(() => EnumClassCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  maxCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  durationMinutes: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  instructorId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dayOfWeek: z.union([ z.lazy(() => DayOfWeekSchema), z.lazy(() => EnumDayOfWeekFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ClassBookingUpsertWithWhereUniqueWithoutClassSessionInputSchema: z.ZodType<Prisma.ClassBookingUpsertWithWhereUniqueWithoutClassSessionInput> = z.strictObject({
  where: z.lazy(() => ClassBookingWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ClassBookingUpdateWithoutClassSessionInputSchema), z.lazy(() => ClassBookingUncheckedUpdateWithoutClassSessionInputSchema) ]),
  create: z.union([ z.lazy(() => ClassBookingCreateWithoutClassSessionInputSchema), z.lazy(() => ClassBookingUncheckedCreateWithoutClassSessionInputSchema) ]),
});

export const ClassBookingUpdateWithWhereUniqueWithoutClassSessionInputSchema: z.ZodType<Prisma.ClassBookingUpdateWithWhereUniqueWithoutClassSessionInput> = z.strictObject({
  where: z.lazy(() => ClassBookingWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ClassBookingUpdateWithoutClassSessionInputSchema), z.lazy(() => ClassBookingUncheckedUpdateWithoutClassSessionInputSchema) ]),
});

export const ClassBookingUpdateManyWithWhereWithoutClassSessionInputSchema: z.ZodType<Prisma.ClassBookingUpdateManyWithWhereWithoutClassSessionInput> = z.strictObject({
  where: z.lazy(() => ClassBookingScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ClassBookingUpdateManyMutationInputSchema), z.lazy(() => ClassBookingUncheckedUpdateManyWithoutClassSessionInputSchema) ]),
});

export const MemberCreateWithoutClassBookingsInputSchema: z.ZodType<Prisma.MemberCreateWithoutClassBookingsInput> = z.strictObject({
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  phone: z.string().optional().nullable(),
  joinDate: z.coerce.date().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  membership: z.lazy(() => MembershipCreateNestedOneWithoutMemberInputSchema).optional(),
});

export const MemberUncheckedCreateWithoutClassBookingsInputSchema: z.ZodType<Prisma.MemberUncheckedCreateWithoutClassBookingsInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  phone: z.string().optional().nullable(),
  joinDate: z.coerce.date().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  membership: z.lazy(() => MembershipUncheckedCreateNestedOneWithoutMemberInputSchema).optional(),
});

export const MemberCreateOrConnectWithoutClassBookingsInputSchema: z.ZodType<Prisma.MemberCreateOrConnectWithoutClassBookingsInput> = z.strictObject({
  where: z.lazy(() => MemberWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MemberCreateWithoutClassBookingsInputSchema), z.lazy(() => MemberUncheckedCreateWithoutClassBookingsInputSchema) ]),
});

export const ClassSessionCreateWithoutBookingsInputSchema: z.ZodType<Prisma.ClassSessionCreateWithoutBookingsInput> = z.strictObject({
  date: z.coerce.date(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  remainingCapacity: z.number().int(),
  status: z.lazy(() => ClassStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  classSchedule: z.lazy(() => ClassScheduleCreateNestedOneWithoutSessionsInputSchema),
});

export const ClassSessionUncheckedCreateWithoutBookingsInputSchema: z.ZodType<Prisma.ClassSessionUncheckedCreateWithoutBookingsInput> = z.strictObject({
  id: z.number().int().optional(),
  classScheduleId: z.number().int(),
  date: z.coerce.date(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  remainingCapacity: z.number().int(),
  status: z.lazy(() => ClassStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
});

export const ClassSessionCreateOrConnectWithoutBookingsInputSchema: z.ZodType<Prisma.ClassSessionCreateOrConnectWithoutBookingsInput> = z.strictObject({
  where: z.lazy(() => ClassSessionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ClassSessionCreateWithoutBookingsInputSchema), z.lazy(() => ClassSessionUncheckedCreateWithoutBookingsInputSchema) ]),
});

export const MemberUpsertWithoutClassBookingsInputSchema: z.ZodType<Prisma.MemberUpsertWithoutClassBookingsInput> = z.strictObject({
  update: z.union([ z.lazy(() => MemberUpdateWithoutClassBookingsInputSchema), z.lazy(() => MemberUncheckedUpdateWithoutClassBookingsInputSchema) ]),
  create: z.union([ z.lazy(() => MemberCreateWithoutClassBookingsInputSchema), z.lazy(() => MemberUncheckedCreateWithoutClassBookingsInputSchema) ]),
  where: z.lazy(() => MemberWhereInputSchema).optional(),
});

export const MemberUpdateToOneWithWhereWithoutClassBookingsInputSchema: z.ZodType<Prisma.MemberUpdateToOneWithWhereWithoutClassBookingsInput> = z.strictObject({
  where: z.lazy(() => MemberWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => MemberUpdateWithoutClassBookingsInputSchema), z.lazy(() => MemberUncheckedUpdateWithoutClassBookingsInputSchema) ]),
});

export const MemberUpdateWithoutClassBookingsInputSchema: z.ZodType<Prisma.MemberUpdateWithoutClassBookingsInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  surname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joinDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema), z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  membership: z.lazy(() => MembershipUpdateOneWithoutMemberNestedInputSchema).optional(),
});

export const MemberUncheckedUpdateWithoutClassBookingsInputSchema: z.ZodType<Prisma.MemberUncheckedUpdateWithoutClassBookingsInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  surname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joinDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema), z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  membership: z.lazy(() => MembershipUncheckedUpdateOneWithoutMemberNestedInputSchema).optional(),
});

export const ClassSessionUpsertWithoutBookingsInputSchema: z.ZodType<Prisma.ClassSessionUpsertWithoutBookingsInput> = z.strictObject({
  update: z.union([ z.lazy(() => ClassSessionUpdateWithoutBookingsInputSchema), z.lazy(() => ClassSessionUncheckedUpdateWithoutBookingsInputSchema) ]),
  create: z.union([ z.lazy(() => ClassSessionCreateWithoutBookingsInputSchema), z.lazy(() => ClassSessionUncheckedCreateWithoutBookingsInputSchema) ]),
  where: z.lazy(() => ClassSessionWhereInputSchema).optional(),
});

export const ClassSessionUpdateToOneWithWhereWithoutBookingsInputSchema: z.ZodType<Prisma.ClassSessionUpdateToOneWithWhereWithoutBookingsInput> = z.strictObject({
  where: z.lazy(() => ClassSessionWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ClassSessionUpdateWithoutBookingsInputSchema), z.lazy(() => ClassSessionUncheckedUpdateWithoutBookingsInputSchema) ]),
});

export const ClassSessionUpdateWithoutBookingsInputSchema: z.ZodType<Prisma.ClassSessionUpdateWithoutBookingsInput> = z.strictObject({
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  remainingCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClassStatusSchema), z.lazy(() => EnumClassStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  classSchedule: z.lazy(() => ClassScheduleUpdateOneRequiredWithoutSessionsNestedInputSchema).optional(),
});

export const ClassSessionUncheckedUpdateWithoutBookingsInputSchema: z.ZodType<Prisma.ClassSessionUncheckedUpdateWithoutBookingsInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  classScheduleId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  remainingCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClassStatusSchema), z.lazy(() => EnumClassStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ClassBookingCreateManyMemberInputSchema: z.ZodType<Prisma.ClassBookingCreateManyMemberInput> = z.strictObject({
  id: z.number().int().optional(),
  classSessionId: z.number().int(),
  bookingDate: z.coerce.date().optional(),
  status: z.lazy(() => ClassBookingStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
});

export const ClassBookingUpdateWithoutMemberInputSchema: z.ZodType<Prisma.ClassBookingUpdateWithoutMemberInput> = z.strictObject({
  bookingDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClassBookingStatusSchema), z.lazy(() => EnumClassBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  classSession: z.lazy(() => ClassSessionUpdateOneRequiredWithoutBookingsNestedInputSchema).optional(),
});

export const ClassBookingUncheckedUpdateWithoutMemberInputSchema: z.ZodType<Prisma.ClassBookingUncheckedUpdateWithoutMemberInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  classSessionId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bookingDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClassBookingStatusSchema), z.lazy(() => EnumClassBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ClassBookingUncheckedUpdateManyWithoutMemberInputSchema: z.ZodType<Prisma.ClassBookingUncheckedUpdateManyWithoutMemberInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  classSessionId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bookingDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClassBookingStatusSchema), z.lazy(() => EnumClassBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ClassScheduleCreateManyInstructorInputSchema: z.ZodType<Prisma.ClassScheduleCreateManyInstructorInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  category: z.lazy(() => ClassCategorySchema),
  maxCapacity: z.number().int(),
  durationMinutes: z.number().int(),
  dayOfWeek: z.lazy(() => DayOfWeekSchema),
  startTime: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
});

export const ClassScheduleUpdateWithoutInstructorInputSchema: z.ZodType<Prisma.ClassScheduleUpdateWithoutInstructorInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => ClassCategorySchema), z.lazy(() => EnumClassCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  maxCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  durationMinutes: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dayOfWeek: z.union([ z.lazy(() => DayOfWeekSchema), z.lazy(() => EnumDayOfWeekFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sessions: z.lazy(() => ClassSessionUpdateManyWithoutClassScheduleNestedInputSchema).optional(),
});

export const ClassScheduleUncheckedUpdateWithoutInstructorInputSchema: z.ZodType<Prisma.ClassScheduleUncheckedUpdateWithoutInstructorInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => ClassCategorySchema), z.lazy(() => EnumClassCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  maxCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  durationMinutes: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dayOfWeek: z.union([ z.lazy(() => DayOfWeekSchema), z.lazy(() => EnumDayOfWeekFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sessions: z.lazy(() => ClassSessionUncheckedUpdateManyWithoutClassScheduleNestedInputSchema).optional(),
});

export const ClassScheduleUncheckedUpdateManyWithoutInstructorInputSchema: z.ZodType<Prisma.ClassScheduleUncheckedUpdateManyWithoutInstructorInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => ClassCategorySchema), z.lazy(() => EnumClassCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  maxCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  durationMinutes: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dayOfWeek: z.union([ z.lazy(() => DayOfWeekSchema), z.lazy(() => EnumDayOfWeekFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const MembershipCreateManyMembershipPlanInputSchema: z.ZodType<Prisma.MembershipCreateManyMembershipPlanInput> = z.strictObject({
  id: z.number().int().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date(),
  status: z.lazy(() => MembershipStatusSchema).optional(),
  lastPaymentMethod: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  lastPaymentDate: z.coerce.date().optional().nullable(),
  lastPaymentAmount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  memberId: z.number().int(),
});

export const MembershipUpdateWithoutMembershipPlanInputSchema: z.ZodType<Prisma.MembershipUpdateWithoutMembershipPlanInput> = z.strictObject({
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => MembershipStatusSchema), z.lazy(() => EnumMembershipStatusFieldUpdateOperationsInputSchema) ]).optional(),
  lastPaymentMethod: z.union([ z.lazy(() => PaymentMethodSchema), z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastPaymentDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastPaymentAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  member: z.lazy(() => MemberUpdateOneRequiredWithoutMembershipNestedInputSchema).optional(),
});

export const MembershipUncheckedUpdateWithoutMembershipPlanInputSchema: z.ZodType<Prisma.MembershipUncheckedUpdateWithoutMembershipPlanInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => MembershipStatusSchema), z.lazy(() => EnumMembershipStatusFieldUpdateOperationsInputSchema) ]).optional(),
  lastPaymentMethod: z.union([ z.lazy(() => PaymentMethodSchema), z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastPaymentDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastPaymentAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  memberId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MembershipUncheckedUpdateManyWithoutMembershipPlanInputSchema: z.ZodType<Prisma.MembershipUncheckedUpdateManyWithoutMembershipPlanInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => MembershipStatusSchema), z.lazy(() => EnumMembershipStatusFieldUpdateOperationsInputSchema) ]).optional(),
  lastPaymentMethod: z.union([ z.lazy(() => PaymentMethodSchema), z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastPaymentDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastPaymentAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  memberId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ClassSessionCreateManyClassScheduleInputSchema: z.ZodType<Prisma.ClassSessionCreateManyClassScheduleInput> = z.strictObject({
  id: z.number().int().optional(),
  date: z.coerce.date(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  remainingCapacity: z.number().int(),
  status: z.lazy(() => ClassStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
});

export const ClassSessionUpdateWithoutClassScheduleInputSchema: z.ZodType<Prisma.ClassSessionUpdateWithoutClassScheduleInput> = z.strictObject({
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  remainingCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClassStatusSchema), z.lazy(() => EnumClassStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bookings: z.lazy(() => ClassBookingUpdateManyWithoutClassSessionNestedInputSchema).optional(),
});

export const ClassSessionUncheckedUpdateWithoutClassScheduleInputSchema: z.ZodType<Prisma.ClassSessionUncheckedUpdateWithoutClassScheduleInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  remainingCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClassStatusSchema), z.lazy(() => EnumClassStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bookings: z.lazy(() => ClassBookingUncheckedUpdateManyWithoutClassSessionNestedInputSchema).optional(),
});

export const ClassSessionUncheckedUpdateManyWithoutClassScheduleInputSchema: z.ZodType<Prisma.ClassSessionUncheckedUpdateManyWithoutClassScheduleInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  remainingCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClassStatusSchema), z.lazy(() => EnumClassStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ClassBookingCreateManyClassSessionInputSchema: z.ZodType<Prisma.ClassBookingCreateManyClassSessionInput> = z.strictObject({
  id: z.number().int().optional(),
  memberId: z.number().int(),
  bookingDate: z.coerce.date().optional(),
  status: z.lazy(() => ClassBookingStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
});

export const ClassBookingUpdateWithoutClassSessionInputSchema: z.ZodType<Prisma.ClassBookingUpdateWithoutClassSessionInput> = z.strictObject({
  bookingDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClassBookingStatusSchema), z.lazy(() => EnumClassBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  member: z.lazy(() => MemberUpdateOneRequiredWithoutClassBookingsNestedInputSchema).optional(),
});

export const ClassBookingUncheckedUpdateWithoutClassSessionInputSchema: z.ZodType<Prisma.ClassBookingUncheckedUpdateWithoutClassSessionInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  memberId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bookingDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClassBookingStatusSchema), z.lazy(() => EnumClassBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ClassBookingUncheckedUpdateManyWithoutClassSessionInputSchema: z.ZodType<Prisma.ClassBookingUncheckedUpdateManyWithoutClassSessionInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  memberId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  bookingDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClassBookingStatusSchema), z.lazy(() => EnumClassBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const MemberFindFirstArgsSchema: z.ZodType<Prisma.MemberFindFirstArgs> = z.object({
  select: MemberSelectSchema.optional(),
  include: MemberIncludeSchema.optional(),
  where: MemberWhereInputSchema.optional(), 
  orderBy: z.union([ MemberOrderByWithRelationInputSchema.array(), MemberOrderByWithRelationInputSchema ]).optional(),
  cursor: MemberWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MemberScalarFieldEnumSchema, MemberScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MemberFindFirstOrThrowArgsSchema: z.ZodType<Prisma.MemberFindFirstOrThrowArgs> = z.object({
  select: MemberSelectSchema.optional(),
  include: MemberIncludeSchema.optional(),
  where: MemberWhereInputSchema.optional(), 
  orderBy: z.union([ MemberOrderByWithRelationInputSchema.array(), MemberOrderByWithRelationInputSchema ]).optional(),
  cursor: MemberWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MemberScalarFieldEnumSchema, MemberScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MemberFindManyArgsSchema: z.ZodType<Prisma.MemberFindManyArgs> = z.object({
  select: MemberSelectSchema.optional(),
  include: MemberIncludeSchema.optional(),
  where: MemberWhereInputSchema.optional(), 
  orderBy: z.union([ MemberOrderByWithRelationInputSchema.array(), MemberOrderByWithRelationInputSchema ]).optional(),
  cursor: MemberWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MemberScalarFieldEnumSchema, MemberScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MemberAggregateArgsSchema: z.ZodType<Prisma.MemberAggregateArgs> = z.object({
  where: MemberWhereInputSchema.optional(), 
  orderBy: z.union([ MemberOrderByWithRelationInputSchema.array(), MemberOrderByWithRelationInputSchema ]).optional(),
  cursor: MemberWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MemberGroupByArgsSchema: z.ZodType<Prisma.MemberGroupByArgs> = z.object({
  where: MemberWhereInputSchema.optional(), 
  orderBy: z.union([ MemberOrderByWithAggregationInputSchema.array(), MemberOrderByWithAggregationInputSchema ]).optional(),
  by: MemberScalarFieldEnumSchema.array(), 
  having: MemberScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MemberFindUniqueArgsSchema: z.ZodType<Prisma.MemberFindUniqueArgs> = z.object({
  select: MemberSelectSchema.optional(),
  include: MemberIncludeSchema.optional(),
  where: MemberWhereUniqueInputSchema, 
}).strict();

export const MemberFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.MemberFindUniqueOrThrowArgs> = z.object({
  select: MemberSelectSchema.optional(),
  include: MemberIncludeSchema.optional(),
  where: MemberWhereUniqueInputSchema, 
}).strict();

export const InstructorFindFirstArgsSchema: z.ZodType<Prisma.InstructorFindFirstArgs> = z.object({
  select: InstructorSelectSchema.optional(),
  include: InstructorIncludeSchema.optional(),
  where: InstructorWhereInputSchema.optional(), 
  orderBy: z.union([ InstructorOrderByWithRelationInputSchema.array(), InstructorOrderByWithRelationInputSchema ]).optional(),
  cursor: InstructorWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ InstructorScalarFieldEnumSchema, InstructorScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const InstructorFindFirstOrThrowArgsSchema: z.ZodType<Prisma.InstructorFindFirstOrThrowArgs> = z.object({
  select: InstructorSelectSchema.optional(),
  include: InstructorIncludeSchema.optional(),
  where: InstructorWhereInputSchema.optional(), 
  orderBy: z.union([ InstructorOrderByWithRelationInputSchema.array(), InstructorOrderByWithRelationInputSchema ]).optional(),
  cursor: InstructorWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ InstructorScalarFieldEnumSchema, InstructorScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const InstructorFindManyArgsSchema: z.ZodType<Prisma.InstructorFindManyArgs> = z.object({
  select: InstructorSelectSchema.optional(),
  include: InstructorIncludeSchema.optional(),
  where: InstructorWhereInputSchema.optional(), 
  orderBy: z.union([ InstructorOrderByWithRelationInputSchema.array(), InstructorOrderByWithRelationInputSchema ]).optional(),
  cursor: InstructorWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ InstructorScalarFieldEnumSchema, InstructorScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const InstructorAggregateArgsSchema: z.ZodType<Prisma.InstructorAggregateArgs> = z.object({
  where: InstructorWhereInputSchema.optional(), 
  orderBy: z.union([ InstructorOrderByWithRelationInputSchema.array(), InstructorOrderByWithRelationInputSchema ]).optional(),
  cursor: InstructorWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const InstructorGroupByArgsSchema: z.ZodType<Prisma.InstructorGroupByArgs> = z.object({
  where: InstructorWhereInputSchema.optional(), 
  orderBy: z.union([ InstructorOrderByWithAggregationInputSchema.array(), InstructorOrderByWithAggregationInputSchema ]).optional(),
  by: InstructorScalarFieldEnumSchema.array(), 
  having: InstructorScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const InstructorFindUniqueArgsSchema: z.ZodType<Prisma.InstructorFindUniqueArgs> = z.object({
  select: InstructorSelectSchema.optional(),
  include: InstructorIncludeSchema.optional(),
  where: InstructorWhereUniqueInputSchema, 
}).strict();

export const InstructorFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.InstructorFindUniqueOrThrowArgs> = z.object({
  select: InstructorSelectSchema.optional(),
  include: InstructorIncludeSchema.optional(),
  where: InstructorWhereUniqueInputSchema, 
}).strict();

export const MembershipFindFirstArgsSchema: z.ZodType<Prisma.MembershipFindFirstArgs> = z.object({
  select: MembershipSelectSchema.optional(),
  include: MembershipIncludeSchema.optional(),
  where: MembershipWhereInputSchema.optional(), 
  orderBy: z.union([ MembershipOrderByWithRelationInputSchema.array(), MembershipOrderByWithRelationInputSchema ]).optional(),
  cursor: MembershipWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MembershipScalarFieldEnumSchema, MembershipScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MembershipFindFirstOrThrowArgsSchema: z.ZodType<Prisma.MembershipFindFirstOrThrowArgs> = z.object({
  select: MembershipSelectSchema.optional(),
  include: MembershipIncludeSchema.optional(),
  where: MembershipWhereInputSchema.optional(), 
  orderBy: z.union([ MembershipOrderByWithRelationInputSchema.array(), MembershipOrderByWithRelationInputSchema ]).optional(),
  cursor: MembershipWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MembershipScalarFieldEnumSchema, MembershipScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MembershipFindManyArgsSchema: z.ZodType<Prisma.MembershipFindManyArgs> = z.object({
  select: MembershipSelectSchema.optional(),
  include: MembershipIncludeSchema.optional(),
  where: MembershipWhereInputSchema.optional(), 
  orderBy: z.union([ MembershipOrderByWithRelationInputSchema.array(), MembershipOrderByWithRelationInputSchema ]).optional(),
  cursor: MembershipWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MembershipScalarFieldEnumSchema, MembershipScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MembershipAggregateArgsSchema: z.ZodType<Prisma.MembershipAggregateArgs> = z.object({
  where: MembershipWhereInputSchema.optional(), 
  orderBy: z.union([ MembershipOrderByWithRelationInputSchema.array(), MembershipOrderByWithRelationInputSchema ]).optional(),
  cursor: MembershipWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MembershipGroupByArgsSchema: z.ZodType<Prisma.MembershipGroupByArgs> = z.object({
  where: MembershipWhereInputSchema.optional(), 
  orderBy: z.union([ MembershipOrderByWithAggregationInputSchema.array(), MembershipOrderByWithAggregationInputSchema ]).optional(),
  by: MembershipScalarFieldEnumSchema.array(), 
  having: MembershipScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MembershipFindUniqueArgsSchema: z.ZodType<Prisma.MembershipFindUniqueArgs> = z.object({
  select: MembershipSelectSchema.optional(),
  include: MembershipIncludeSchema.optional(),
  where: MembershipWhereUniqueInputSchema, 
}).strict();

export const MembershipFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.MembershipFindUniqueOrThrowArgs> = z.object({
  select: MembershipSelectSchema.optional(),
  include: MembershipIncludeSchema.optional(),
  where: MembershipWhereUniqueInputSchema, 
}).strict();

export const MembershipPlanFindFirstArgsSchema: z.ZodType<Prisma.MembershipPlanFindFirstArgs> = z.object({
  select: MembershipPlanSelectSchema.optional(),
  include: MembershipPlanIncludeSchema.optional(),
  where: MembershipPlanWhereInputSchema.optional(), 
  orderBy: z.union([ MembershipPlanOrderByWithRelationInputSchema.array(), MembershipPlanOrderByWithRelationInputSchema ]).optional(),
  cursor: MembershipPlanWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MembershipPlanScalarFieldEnumSchema, MembershipPlanScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MembershipPlanFindFirstOrThrowArgsSchema: z.ZodType<Prisma.MembershipPlanFindFirstOrThrowArgs> = z.object({
  select: MembershipPlanSelectSchema.optional(),
  include: MembershipPlanIncludeSchema.optional(),
  where: MembershipPlanWhereInputSchema.optional(), 
  orderBy: z.union([ MembershipPlanOrderByWithRelationInputSchema.array(), MembershipPlanOrderByWithRelationInputSchema ]).optional(),
  cursor: MembershipPlanWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MembershipPlanScalarFieldEnumSchema, MembershipPlanScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MembershipPlanFindManyArgsSchema: z.ZodType<Prisma.MembershipPlanFindManyArgs> = z.object({
  select: MembershipPlanSelectSchema.optional(),
  include: MembershipPlanIncludeSchema.optional(),
  where: MembershipPlanWhereInputSchema.optional(), 
  orderBy: z.union([ MembershipPlanOrderByWithRelationInputSchema.array(), MembershipPlanOrderByWithRelationInputSchema ]).optional(),
  cursor: MembershipPlanWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MembershipPlanScalarFieldEnumSchema, MembershipPlanScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MembershipPlanAggregateArgsSchema: z.ZodType<Prisma.MembershipPlanAggregateArgs> = z.object({
  where: MembershipPlanWhereInputSchema.optional(), 
  orderBy: z.union([ MembershipPlanOrderByWithRelationInputSchema.array(), MembershipPlanOrderByWithRelationInputSchema ]).optional(),
  cursor: MembershipPlanWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MembershipPlanGroupByArgsSchema: z.ZodType<Prisma.MembershipPlanGroupByArgs> = z.object({
  where: MembershipPlanWhereInputSchema.optional(), 
  orderBy: z.union([ MembershipPlanOrderByWithAggregationInputSchema.array(), MembershipPlanOrderByWithAggregationInputSchema ]).optional(),
  by: MembershipPlanScalarFieldEnumSchema.array(), 
  having: MembershipPlanScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MembershipPlanFindUniqueArgsSchema: z.ZodType<Prisma.MembershipPlanFindUniqueArgs> = z.object({
  select: MembershipPlanSelectSchema.optional(),
  include: MembershipPlanIncludeSchema.optional(),
  where: MembershipPlanWhereUniqueInputSchema, 
}).strict();

export const MembershipPlanFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.MembershipPlanFindUniqueOrThrowArgs> = z.object({
  select: MembershipPlanSelectSchema.optional(),
  include: MembershipPlanIncludeSchema.optional(),
  where: MembershipPlanWhereUniqueInputSchema, 
}).strict();

export const ClassScheduleFindFirstArgsSchema: z.ZodType<Prisma.ClassScheduleFindFirstArgs> = z.object({
  select: ClassScheduleSelectSchema.optional(),
  include: ClassScheduleIncludeSchema.optional(),
  where: ClassScheduleWhereInputSchema.optional(), 
  orderBy: z.union([ ClassScheduleOrderByWithRelationInputSchema.array(), ClassScheduleOrderByWithRelationInputSchema ]).optional(),
  cursor: ClassScheduleWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ClassScheduleScalarFieldEnumSchema, ClassScheduleScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ClassScheduleFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ClassScheduleFindFirstOrThrowArgs> = z.object({
  select: ClassScheduleSelectSchema.optional(),
  include: ClassScheduleIncludeSchema.optional(),
  where: ClassScheduleWhereInputSchema.optional(), 
  orderBy: z.union([ ClassScheduleOrderByWithRelationInputSchema.array(), ClassScheduleOrderByWithRelationInputSchema ]).optional(),
  cursor: ClassScheduleWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ClassScheduleScalarFieldEnumSchema, ClassScheduleScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ClassScheduleFindManyArgsSchema: z.ZodType<Prisma.ClassScheduleFindManyArgs> = z.object({
  select: ClassScheduleSelectSchema.optional(),
  include: ClassScheduleIncludeSchema.optional(),
  where: ClassScheduleWhereInputSchema.optional(), 
  orderBy: z.union([ ClassScheduleOrderByWithRelationInputSchema.array(), ClassScheduleOrderByWithRelationInputSchema ]).optional(),
  cursor: ClassScheduleWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ClassScheduleScalarFieldEnumSchema, ClassScheduleScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ClassScheduleAggregateArgsSchema: z.ZodType<Prisma.ClassScheduleAggregateArgs> = z.object({
  where: ClassScheduleWhereInputSchema.optional(), 
  orderBy: z.union([ ClassScheduleOrderByWithRelationInputSchema.array(), ClassScheduleOrderByWithRelationInputSchema ]).optional(),
  cursor: ClassScheduleWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ClassScheduleGroupByArgsSchema: z.ZodType<Prisma.ClassScheduleGroupByArgs> = z.object({
  where: ClassScheduleWhereInputSchema.optional(), 
  orderBy: z.union([ ClassScheduleOrderByWithAggregationInputSchema.array(), ClassScheduleOrderByWithAggregationInputSchema ]).optional(),
  by: ClassScheduleScalarFieldEnumSchema.array(), 
  having: ClassScheduleScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ClassScheduleFindUniqueArgsSchema: z.ZodType<Prisma.ClassScheduleFindUniqueArgs> = z.object({
  select: ClassScheduleSelectSchema.optional(),
  include: ClassScheduleIncludeSchema.optional(),
  where: ClassScheduleWhereUniqueInputSchema, 
}).strict();

export const ClassScheduleFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ClassScheduleFindUniqueOrThrowArgs> = z.object({
  select: ClassScheduleSelectSchema.optional(),
  include: ClassScheduleIncludeSchema.optional(),
  where: ClassScheduleWhereUniqueInputSchema, 
}).strict();

export const ClassSessionFindFirstArgsSchema: z.ZodType<Prisma.ClassSessionFindFirstArgs> = z.object({
  select: ClassSessionSelectSchema.optional(),
  include: ClassSessionIncludeSchema.optional(),
  where: ClassSessionWhereInputSchema.optional(), 
  orderBy: z.union([ ClassSessionOrderByWithRelationInputSchema.array(), ClassSessionOrderByWithRelationInputSchema ]).optional(),
  cursor: ClassSessionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ClassSessionScalarFieldEnumSchema, ClassSessionScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ClassSessionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ClassSessionFindFirstOrThrowArgs> = z.object({
  select: ClassSessionSelectSchema.optional(),
  include: ClassSessionIncludeSchema.optional(),
  where: ClassSessionWhereInputSchema.optional(), 
  orderBy: z.union([ ClassSessionOrderByWithRelationInputSchema.array(), ClassSessionOrderByWithRelationInputSchema ]).optional(),
  cursor: ClassSessionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ClassSessionScalarFieldEnumSchema, ClassSessionScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ClassSessionFindManyArgsSchema: z.ZodType<Prisma.ClassSessionFindManyArgs> = z.object({
  select: ClassSessionSelectSchema.optional(),
  include: ClassSessionIncludeSchema.optional(),
  where: ClassSessionWhereInputSchema.optional(), 
  orderBy: z.union([ ClassSessionOrderByWithRelationInputSchema.array(), ClassSessionOrderByWithRelationInputSchema ]).optional(),
  cursor: ClassSessionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ClassSessionScalarFieldEnumSchema, ClassSessionScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ClassSessionAggregateArgsSchema: z.ZodType<Prisma.ClassSessionAggregateArgs> = z.object({
  where: ClassSessionWhereInputSchema.optional(), 
  orderBy: z.union([ ClassSessionOrderByWithRelationInputSchema.array(), ClassSessionOrderByWithRelationInputSchema ]).optional(),
  cursor: ClassSessionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ClassSessionGroupByArgsSchema: z.ZodType<Prisma.ClassSessionGroupByArgs> = z.object({
  where: ClassSessionWhereInputSchema.optional(), 
  orderBy: z.union([ ClassSessionOrderByWithAggregationInputSchema.array(), ClassSessionOrderByWithAggregationInputSchema ]).optional(),
  by: ClassSessionScalarFieldEnumSchema.array(), 
  having: ClassSessionScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ClassSessionFindUniqueArgsSchema: z.ZodType<Prisma.ClassSessionFindUniqueArgs> = z.object({
  select: ClassSessionSelectSchema.optional(),
  include: ClassSessionIncludeSchema.optional(),
  where: ClassSessionWhereUniqueInputSchema, 
}).strict();

export const ClassSessionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ClassSessionFindUniqueOrThrowArgs> = z.object({
  select: ClassSessionSelectSchema.optional(),
  include: ClassSessionIncludeSchema.optional(),
  where: ClassSessionWhereUniqueInputSchema, 
}).strict();

export const ClassBookingFindFirstArgsSchema: z.ZodType<Prisma.ClassBookingFindFirstArgs> = z.object({
  select: ClassBookingSelectSchema.optional(),
  include: ClassBookingIncludeSchema.optional(),
  where: ClassBookingWhereInputSchema.optional(), 
  orderBy: z.union([ ClassBookingOrderByWithRelationInputSchema.array(), ClassBookingOrderByWithRelationInputSchema ]).optional(),
  cursor: ClassBookingWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ClassBookingScalarFieldEnumSchema, ClassBookingScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ClassBookingFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ClassBookingFindFirstOrThrowArgs> = z.object({
  select: ClassBookingSelectSchema.optional(),
  include: ClassBookingIncludeSchema.optional(),
  where: ClassBookingWhereInputSchema.optional(), 
  orderBy: z.union([ ClassBookingOrderByWithRelationInputSchema.array(), ClassBookingOrderByWithRelationInputSchema ]).optional(),
  cursor: ClassBookingWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ClassBookingScalarFieldEnumSchema, ClassBookingScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ClassBookingFindManyArgsSchema: z.ZodType<Prisma.ClassBookingFindManyArgs> = z.object({
  select: ClassBookingSelectSchema.optional(),
  include: ClassBookingIncludeSchema.optional(),
  where: ClassBookingWhereInputSchema.optional(), 
  orderBy: z.union([ ClassBookingOrderByWithRelationInputSchema.array(), ClassBookingOrderByWithRelationInputSchema ]).optional(),
  cursor: ClassBookingWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ClassBookingScalarFieldEnumSchema, ClassBookingScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ClassBookingAggregateArgsSchema: z.ZodType<Prisma.ClassBookingAggregateArgs> = z.object({
  where: ClassBookingWhereInputSchema.optional(), 
  orderBy: z.union([ ClassBookingOrderByWithRelationInputSchema.array(), ClassBookingOrderByWithRelationInputSchema ]).optional(),
  cursor: ClassBookingWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ClassBookingGroupByArgsSchema: z.ZodType<Prisma.ClassBookingGroupByArgs> = z.object({
  where: ClassBookingWhereInputSchema.optional(), 
  orderBy: z.union([ ClassBookingOrderByWithAggregationInputSchema.array(), ClassBookingOrderByWithAggregationInputSchema ]).optional(),
  by: ClassBookingScalarFieldEnumSchema.array(), 
  having: ClassBookingScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ClassBookingFindUniqueArgsSchema: z.ZodType<Prisma.ClassBookingFindUniqueArgs> = z.object({
  select: ClassBookingSelectSchema.optional(),
  include: ClassBookingIncludeSchema.optional(),
  where: ClassBookingWhereUniqueInputSchema, 
}).strict();

export const ClassBookingFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ClassBookingFindUniqueOrThrowArgs> = z.object({
  select: ClassBookingSelectSchema.optional(),
  include: ClassBookingIncludeSchema.optional(),
  where: ClassBookingWhereUniqueInputSchema, 
}).strict();

export const ExerciseFindFirstArgsSchema: z.ZodType<Prisma.ExerciseFindFirstArgs> = z.object({
  select: ExerciseSelectSchema.optional(),
  where: ExerciseWhereInputSchema.optional(), 
  orderBy: z.union([ ExerciseOrderByWithRelationInputSchema.array(), ExerciseOrderByWithRelationInputSchema ]).optional(),
  cursor: ExerciseWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExerciseScalarFieldEnumSchema, ExerciseScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ExerciseFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ExerciseFindFirstOrThrowArgs> = z.object({
  select: ExerciseSelectSchema.optional(),
  where: ExerciseWhereInputSchema.optional(), 
  orderBy: z.union([ ExerciseOrderByWithRelationInputSchema.array(), ExerciseOrderByWithRelationInputSchema ]).optional(),
  cursor: ExerciseWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExerciseScalarFieldEnumSchema, ExerciseScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ExerciseFindManyArgsSchema: z.ZodType<Prisma.ExerciseFindManyArgs> = z.object({
  select: ExerciseSelectSchema.optional(),
  where: ExerciseWhereInputSchema.optional(), 
  orderBy: z.union([ ExerciseOrderByWithRelationInputSchema.array(), ExerciseOrderByWithRelationInputSchema ]).optional(),
  cursor: ExerciseWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExerciseScalarFieldEnumSchema, ExerciseScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ExerciseAggregateArgsSchema: z.ZodType<Prisma.ExerciseAggregateArgs> = z.object({
  where: ExerciseWhereInputSchema.optional(), 
  orderBy: z.union([ ExerciseOrderByWithRelationInputSchema.array(), ExerciseOrderByWithRelationInputSchema ]).optional(),
  cursor: ExerciseWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ExerciseGroupByArgsSchema: z.ZodType<Prisma.ExerciseGroupByArgs> = z.object({
  where: ExerciseWhereInputSchema.optional(), 
  orderBy: z.union([ ExerciseOrderByWithAggregationInputSchema.array(), ExerciseOrderByWithAggregationInputSchema ]).optional(),
  by: ExerciseScalarFieldEnumSchema.array(), 
  having: ExerciseScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ExerciseFindUniqueArgsSchema: z.ZodType<Prisma.ExerciseFindUniqueArgs> = z.object({
  select: ExerciseSelectSchema.optional(),
  where: ExerciseWhereUniqueInputSchema, 
}).strict();

export const ExerciseFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ExerciseFindUniqueOrThrowArgs> = z.object({
  select: ExerciseSelectSchema.optional(),
  where: ExerciseWhereUniqueInputSchema, 
}).strict();

export const MemberCreateArgsSchema: z.ZodType<Prisma.MemberCreateArgs> = z.object({
  select: MemberSelectSchema.optional(),
  include: MemberIncludeSchema.optional(),
  data: z.union([ MemberCreateInputSchema, MemberUncheckedCreateInputSchema ]),
}).strict();

export const MemberUpsertArgsSchema: z.ZodType<Prisma.MemberUpsertArgs> = z.object({
  select: MemberSelectSchema.optional(),
  include: MemberIncludeSchema.optional(),
  where: MemberWhereUniqueInputSchema, 
  create: z.union([ MemberCreateInputSchema, MemberUncheckedCreateInputSchema ]),
  update: z.union([ MemberUpdateInputSchema, MemberUncheckedUpdateInputSchema ]),
}).strict();

export const MemberCreateManyArgsSchema: z.ZodType<Prisma.MemberCreateManyArgs> = z.object({
  data: z.union([ MemberCreateManyInputSchema, MemberCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MemberDeleteArgsSchema: z.ZodType<Prisma.MemberDeleteArgs> = z.object({
  select: MemberSelectSchema.optional(),
  include: MemberIncludeSchema.optional(),
  where: MemberWhereUniqueInputSchema, 
}).strict();

export const MemberUpdateArgsSchema: z.ZodType<Prisma.MemberUpdateArgs> = z.object({
  select: MemberSelectSchema.optional(),
  include: MemberIncludeSchema.optional(),
  data: z.union([ MemberUpdateInputSchema, MemberUncheckedUpdateInputSchema ]),
  where: MemberWhereUniqueInputSchema, 
}).strict();

export const MemberUpdateManyArgsSchema: z.ZodType<Prisma.MemberUpdateManyArgs> = z.object({
  data: z.union([ MemberUpdateManyMutationInputSchema, MemberUncheckedUpdateManyInputSchema ]),
  where: MemberWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MemberDeleteManyArgsSchema: z.ZodType<Prisma.MemberDeleteManyArgs> = z.object({
  where: MemberWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const InstructorCreateArgsSchema: z.ZodType<Prisma.InstructorCreateArgs> = z.object({
  select: InstructorSelectSchema.optional(),
  include: InstructorIncludeSchema.optional(),
  data: z.union([ InstructorCreateInputSchema, InstructorUncheckedCreateInputSchema ]),
}).strict();

export const InstructorUpsertArgsSchema: z.ZodType<Prisma.InstructorUpsertArgs> = z.object({
  select: InstructorSelectSchema.optional(),
  include: InstructorIncludeSchema.optional(),
  where: InstructorWhereUniqueInputSchema, 
  create: z.union([ InstructorCreateInputSchema, InstructorUncheckedCreateInputSchema ]),
  update: z.union([ InstructorUpdateInputSchema, InstructorUncheckedUpdateInputSchema ]),
}).strict();

export const InstructorCreateManyArgsSchema: z.ZodType<Prisma.InstructorCreateManyArgs> = z.object({
  data: z.union([ InstructorCreateManyInputSchema, InstructorCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const InstructorDeleteArgsSchema: z.ZodType<Prisma.InstructorDeleteArgs> = z.object({
  select: InstructorSelectSchema.optional(),
  include: InstructorIncludeSchema.optional(),
  where: InstructorWhereUniqueInputSchema, 
}).strict();

export const InstructorUpdateArgsSchema: z.ZodType<Prisma.InstructorUpdateArgs> = z.object({
  select: InstructorSelectSchema.optional(),
  include: InstructorIncludeSchema.optional(),
  data: z.union([ InstructorUpdateInputSchema, InstructorUncheckedUpdateInputSchema ]),
  where: InstructorWhereUniqueInputSchema, 
}).strict();

export const InstructorUpdateManyArgsSchema: z.ZodType<Prisma.InstructorUpdateManyArgs> = z.object({
  data: z.union([ InstructorUpdateManyMutationInputSchema, InstructorUncheckedUpdateManyInputSchema ]),
  where: InstructorWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const InstructorDeleteManyArgsSchema: z.ZodType<Prisma.InstructorDeleteManyArgs> = z.object({
  where: InstructorWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MembershipCreateArgsSchema: z.ZodType<Prisma.MembershipCreateArgs> = z.object({
  select: MembershipSelectSchema.optional(),
  include: MembershipIncludeSchema.optional(),
  data: z.union([ MembershipCreateInputSchema, MembershipUncheckedCreateInputSchema ]),
}).strict();

export const MembershipUpsertArgsSchema: z.ZodType<Prisma.MembershipUpsertArgs> = z.object({
  select: MembershipSelectSchema.optional(),
  include: MembershipIncludeSchema.optional(),
  where: MembershipWhereUniqueInputSchema, 
  create: z.union([ MembershipCreateInputSchema, MembershipUncheckedCreateInputSchema ]),
  update: z.union([ MembershipUpdateInputSchema, MembershipUncheckedUpdateInputSchema ]),
}).strict();

export const MembershipCreateManyArgsSchema: z.ZodType<Prisma.MembershipCreateManyArgs> = z.object({
  data: z.union([ MembershipCreateManyInputSchema, MembershipCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MembershipDeleteArgsSchema: z.ZodType<Prisma.MembershipDeleteArgs> = z.object({
  select: MembershipSelectSchema.optional(),
  include: MembershipIncludeSchema.optional(),
  where: MembershipWhereUniqueInputSchema, 
}).strict();

export const MembershipUpdateArgsSchema: z.ZodType<Prisma.MembershipUpdateArgs> = z.object({
  select: MembershipSelectSchema.optional(),
  include: MembershipIncludeSchema.optional(),
  data: z.union([ MembershipUpdateInputSchema, MembershipUncheckedUpdateInputSchema ]),
  where: MembershipWhereUniqueInputSchema, 
}).strict();

export const MembershipUpdateManyArgsSchema: z.ZodType<Prisma.MembershipUpdateManyArgs> = z.object({
  data: z.union([ MembershipUpdateManyMutationInputSchema, MembershipUncheckedUpdateManyInputSchema ]),
  where: MembershipWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MembershipDeleteManyArgsSchema: z.ZodType<Prisma.MembershipDeleteManyArgs> = z.object({
  where: MembershipWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MembershipPlanCreateArgsSchema: z.ZodType<Prisma.MembershipPlanCreateArgs> = z.object({
  select: MembershipPlanSelectSchema.optional(),
  include: MembershipPlanIncludeSchema.optional(),
  data: z.union([ MembershipPlanCreateInputSchema, MembershipPlanUncheckedCreateInputSchema ]),
}).strict();

export const MembershipPlanUpsertArgsSchema: z.ZodType<Prisma.MembershipPlanUpsertArgs> = z.object({
  select: MembershipPlanSelectSchema.optional(),
  include: MembershipPlanIncludeSchema.optional(),
  where: MembershipPlanWhereUniqueInputSchema, 
  create: z.union([ MembershipPlanCreateInputSchema, MembershipPlanUncheckedCreateInputSchema ]),
  update: z.union([ MembershipPlanUpdateInputSchema, MembershipPlanUncheckedUpdateInputSchema ]),
}).strict();

export const MembershipPlanCreateManyArgsSchema: z.ZodType<Prisma.MembershipPlanCreateManyArgs> = z.object({
  data: z.union([ MembershipPlanCreateManyInputSchema, MembershipPlanCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MembershipPlanDeleteArgsSchema: z.ZodType<Prisma.MembershipPlanDeleteArgs> = z.object({
  select: MembershipPlanSelectSchema.optional(),
  include: MembershipPlanIncludeSchema.optional(),
  where: MembershipPlanWhereUniqueInputSchema, 
}).strict();

export const MembershipPlanUpdateArgsSchema: z.ZodType<Prisma.MembershipPlanUpdateArgs> = z.object({
  select: MembershipPlanSelectSchema.optional(),
  include: MembershipPlanIncludeSchema.optional(),
  data: z.union([ MembershipPlanUpdateInputSchema, MembershipPlanUncheckedUpdateInputSchema ]),
  where: MembershipPlanWhereUniqueInputSchema, 
}).strict();

export const MembershipPlanUpdateManyArgsSchema: z.ZodType<Prisma.MembershipPlanUpdateManyArgs> = z.object({
  data: z.union([ MembershipPlanUpdateManyMutationInputSchema, MembershipPlanUncheckedUpdateManyInputSchema ]),
  where: MembershipPlanWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MembershipPlanDeleteManyArgsSchema: z.ZodType<Prisma.MembershipPlanDeleteManyArgs> = z.object({
  where: MembershipPlanWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ClassScheduleCreateArgsSchema: z.ZodType<Prisma.ClassScheduleCreateArgs> = z.object({
  select: ClassScheduleSelectSchema.optional(),
  include: ClassScheduleIncludeSchema.optional(),
  data: z.union([ ClassScheduleCreateInputSchema, ClassScheduleUncheckedCreateInputSchema ]),
}).strict();

export const ClassScheduleUpsertArgsSchema: z.ZodType<Prisma.ClassScheduleUpsertArgs> = z.object({
  select: ClassScheduleSelectSchema.optional(),
  include: ClassScheduleIncludeSchema.optional(),
  where: ClassScheduleWhereUniqueInputSchema, 
  create: z.union([ ClassScheduleCreateInputSchema, ClassScheduleUncheckedCreateInputSchema ]),
  update: z.union([ ClassScheduleUpdateInputSchema, ClassScheduleUncheckedUpdateInputSchema ]),
}).strict();

export const ClassScheduleCreateManyArgsSchema: z.ZodType<Prisma.ClassScheduleCreateManyArgs> = z.object({
  data: z.union([ ClassScheduleCreateManyInputSchema, ClassScheduleCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ClassScheduleDeleteArgsSchema: z.ZodType<Prisma.ClassScheduleDeleteArgs> = z.object({
  select: ClassScheduleSelectSchema.optional(),
  include: ClassScheduleIncludeSchema.optional(),
  where: ClassScheduleWhereUniqueInputSchema, 
}).strict();

export const ClassScheduleUpdateArgsSchema: z.ZodType<Prisma.ClassScheduleUpdateArgs> = z.object({
  select: ClassScheduleSelectSchema.optional(),
  include: ClassScheduleIncludeSchema.optional(),
  data: z.union([ ClassScheduleUpdateInputSchema, ClassScheduleUncheckedUpdateInputSchema ]),
  where: ClassScheduleWhereUniqueInputSchema, 
}).strict();

export const ClassScheduleUpdateManyArgsSchema: z.ZodType<Prisma.ClassScheduleUpdateManyArgs> = z.object({
  data: z.union([ ClassScheduleUpdateManyMutationInputSchema, ClassScheduleUncheckedUpdateManyInputSchema ]),
  where: ClassScheduleWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ClassScheduleDeleteManyArgsSchema: z.ZodType<Prisma.ClassScheduleDeleteManyArgs> = z.object({
  where: ClassScheduleWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ClassSessionCreateArgsSchema: z.ZodType<Prisma.ClassSessionCreateArgs> = z.object({
  select: ClassSessionSelectSchema.optional(),
  include: ClassSessionIncludeSchema.optional(),
  data: z.union([ ClassSessionCreateInputSchema, ClassSessionUncheckedCreateInputSchema ]),
}).strict();

export const ClassSessionUpsertArgsSchema: z.ZodType<Prisma.ClassSessionUpsertArgs> = z.object({
  select: ClassSessionSelectSchema.optional(),
  include: ClassSessionIncludeSchema.optional(),
  where: ClassSessionWhereUniqueInputSchema, 
  create: z.union([ ClassSessionCreateInputSchema, ClassSessionUncheckedCreateInputSchema ]),
  update: z.union([ ClassSessionUpdateInputSchema, ClassSessionUncheckedUpdateInputSchema ]),
}).strict();

export const ClassSessionCreateManyArgsSchema: z.ZodType<Prisma.ClassSessionCreateManyArgs> = z.object({
  data: z.union([ ClassSessionCreateManyInputSchema, ClassSessionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ClassSessionDeleteArgsSchema: z.ZodType<Prisma.ClassSessionDeleteArgs> = z.object({
  select: ClassSessionSelectSchema.optional(),
  include: ClassSessionIncludeSchema.optional(),
  where: ClassSessionWhereUniqueInputSchema, 
}).strict();

export const ClassSessionUpdateArgsSchema: z.ZodType<Prisma.ClassSessionUpdateArgs> = z.object({
  select: ClassSessionSelectSchema.optional(),
  include: ClassSessionIncludeSchema.optional(),
  data: z.union([ ClassSessionUpdateInputSchema, ClassSessionUncheckedUpdateInputSchema ]),
  where: ClassSessionWhereUniqueInputSchema, 
}).strict();

export const ClassSessionUpdateManyArgsSchema: z.ZodType<Prisma.ClassSessionUpdateManyArgs> = z.object({
  data: z.union([ ClassSessionUpdateManyMutationInputSchema, ClassSessionUncheckedUpdateManyInputSchema ]),
  where: ClassSessionWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ClassSessionDeleteManyArgsSchema: z.ZodType<Prisma.ClassSessionDeleteManyArgs> = z.object({
  where: ClassSessionWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ClassBookingCreateArgsSchema: z.ZodType<Prisma.ClassBookingCreateArgs> = z.object({
  select: ClassBookingSelectSchema.optional(),
  include: ClassBookingIncludeSchema.optional(),
  data: z.union([ ClassBookingCreateInputSchema, ClassBookingUncheckedCreateInputSchema ]),
}).strict();

export const ClassBookingUpsertArgsSchema: z.ZodType<Prisma.ClassBookingUpsertArgs> = z.object({
  select: ClassBookingSelectSchema.optional(),
  include: ClassBookingIncludeSchema.optional(),
  where: ClassBookingWhereUniqueInputSchema, 
  create: z.union([ ClassBookingCreateInputSchema, ClassBookingUncheckedCreateInputSchema ]),
  update: z.union([ ClassBookingUpdateInputSchema, ClassBookingUncheckedUpdateInputSchema ]),
}).strict();

export const ClassBookingCreateManyArgsSchema: z.ZodType<Prisma.ClassBookingCreateManyArgs> = z.object({
  data: z.union([ ClassBookingCreateManyInputSchema, ClassBookingCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ClassBookingDeleteArgsSchema: z.ZodType<Prisma.ClassBookingDeleteArgs> = z.object({
  select: ClassBookingSelectSchema.optional(),
  include: ClassBookingIncludeSchema.optional(),
  where: ClassBookingWhereUniqueInputSchema, 
}).strict();

export const ClassBookingUpdateArgsSchema: z.ZodType<Prisma.ClassBookingUpdateArgs> = z.object({
  select: ClassBookingSelectSchema.optional(),
  include: ClassBookingIncludeSchema.optional(),
  data: z.union([ ClassBookingUpdateInputSchema, ClassBookingUncheckedUpdateInputSchema ]),
  where: ClassBookingWhereUniqueInputSchema, 
}).strict();

export const ClassBookingUpdateManyArgsSchema: z.ZodType<Prisma.ClassBookingUpdateManyArgs> = z.object({
  data: z.union([ ClassBookingUpdateManyMutationInputSchema, ClassBookingUncheckedUpdateManyInputSchema ]),
  where: ClassBookingWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ClassBookingDeleteManyArgsSchema: z.ZodType<Prisma.ClassBookingDeleteManyArgs> = z.object({
  where: ClassBookingWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ExerciseCreateArgsSchema: z.ZodType<Prisma.ExerciseCreateArgs> = z.object({
  select: ExerciseSelectSchema.optional(),
  data: z.union([ ExerciseCreateInputSchema, ExerciseUncheckedCreateInputSchema ]),
}).strict();

export const ExerciseUpsertArgsSchema: z.ZodType<Prisma.ExerciseUpsertArgs> = z.object({
  select: ExerciseSelectSchema.optional(),
  where: ExerciseWhereUniqueInputSchema, 
  create: z.union([ ExerciseCreateInputSchema, ExerciseUncheckedCreateInputSchema ]),
  update: z.union([ ExerciseUpdateInputSchema, ExerciseUncheckedUpdateInputSchema ]),
}).strict();

export const ExerciseCreateManyArgsSchema: z.ZodType<Prisma.ExerciseCreateManyArgs> = z.object({
  data: z.union([ ExerciseCreateManyInputSchema, ExerciseCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ExerciseDeleteArgsSchema: z.ZodType<Prisma.ExerciseDeleteArgs> = z.object({
  select: ExerciseSelectSchema.optional(),
  where: ExerciseWhereUniqueInputSchema, 
}).strict();

export const ExerciseUpdateArgsSchema: z.ZodType<Prisma.ExerciseUpdateArgs> = z.object({
  select: ExerciseSelectSchema.optional(),
  data: z.union([ ExerciseUpdateInputSchema, ExerciseUncheckedUpdateInputSchema ]),
  where: ExerciseWhereUniqueInputSchema, 
}).strict();

export const ExerciseUpdateManyArgsSchema: z.ZodType<Prisma.ExerciseUpdateManyArgs> = z.object({
  data: z.union([ ExerciseUpdateManyMutationInputSchema, ExerciseUncheckedUpdateManyInputSchema ]),
  where: ExerciseWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ExerciseDeleteManyArgsSchema: z.ZodType<Prisma.ExerciseDeleteManyArgs> = z.object({
  where: ExerciseWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();