import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT) : 3306,
});

const prisma = new PrismaClient({ adapter });

const membershipPlans = [
  {
    name: "Básico",
    description: "Acceso a sala de musculación",
    price: 28000,
    durationDays: 30,
  },
  {
    name: "Plus",
    description: "Acceso a sala de musculación y clases grupales",
    price: 36000,
    durationDays: 30,
  },
  {
    name: "Premium",
    description: "Todos los beneficios más seguimiento personalizado",
    price: 49000,
    durationDays: 30,
  },
];

const now = new Date();
const daysToMs = (days: number) => days * 24 * 60 * 60 * 1000;

const members = [
  {
    name: "Juan",
    surname: "Pérez",
    email: "juan.perez@example.com",
    phone: "1123456789",
    docNumber: "30111222",
    birthDate: new Date("1990-05-12"),
    memberStatus: "ACTIVE" as const,
    planName: "Básico",
    membershipStatus: "ACTIVE" as const,
    paymentsHistory: [
      {
        periodStart: new Date(now.getTime() - daysToMs(60)),
        periodEnd: new Date(now.getTime() - daysToMs(30)),
        paymentDate: new Date(now.getTime() - daysToMs(60)),
        method: "CASH" as const,
      },
      {
        periodStart: new Date(now.getTime() - daysToMs(30)),
        periodEnd: new Date(now.getTime() + daysToMs(30)),
        paymentDate: new Date(now.getTime() - daysToMs(30)),
        method: "TRANSFER" as const,
      },
    ],
  },
  {
    name: "María",
    surname: "Gómez",
    email: "maria.gomez@example.com",
    phone: "1134567890",
    docNumber: "32222333",
    birthDate: new Date("1988-11-03"),
    memberStatus: "ACTIVE" as const,
    planName: "Plus",
    membershipStatus: "ACTIVE" as const,
    paymentsHistory: [
      {
        periodStart: new Date(now.getTime() - daysToMs(90)),
        periodEnd: new Date(now.getTime() - daysToMs(60)),
        paymentDate: new Date(now.getTime() - daysToMs(90)),
        method: "CREDIT_CARD" as const,
      },
      {
        periodStart: new Date(now.getTime() - daysToMs(60)),
        periodEnd: new Date(now.getTime() - daysToMs(30)),
        paymentDate: new Date(now.getTime() - daysToMs(60)),
        method: "CREDIT_CARD" as const,
      },
      {
        periodStart: new Date(now.getTime() - daysToMs(30)),
        periodEnd: new Date(now.getTime() + daysToMs(30)),
        paymentDate: new Date(now.getTime() - daysToMs(30)),
        method: "CREDIT_CARD" as const,
      },
    ],
  },
  {
    name: "Carlos",
    surname: "Fernández",
    email: "carlos.fernandez@example.com",
    phone: "1145678901",
    docNumber: "28333444",
    birthDate: new Date("1995-02-20"),
    memberStatus: "ACTIVE" as const,
    planName: "Premium",
    membershipStatus: "ACTIVE" as const,
    paymentsHistory: [
      {
        periodStart: new Date(now.getTime() - daysToMs(15)),
        periodEnd: new Date(now.getTime() + daysToMs(15)),
        paymentDate: new Date(now.getTime() - daysToMs(15)),
        method: "TRANSFER" as const,
      },
    ],
  },
  {
    name: "Lucía",
    surname: "Martínez",
    email: "lucia.martinez@example.com",
    phone: "1156789012",
    docNumber: "35444555",
    birthDate: new Date("1999-07-08"),
    memberStatus: "INACTIVE" as const,
    planName: "Plus",
    membershipStatus: "CANCELLED" as const,
    paymentsHistory: [
      {
        periodStart: new Date(now.getTime() - daysToMs(60)),
        periodEnd: new Date(now.getTime() - daysToMs(30)),
        paymentDate: new Date(now.getTime() - daysToMs(60)),
        method: "DEBIT_CARD" as const,
      },
      {
        periodStart: new Date(now.getTime() - daysToMs(30)),
        periodEnd: new Date(now.getTime() + daysToMs(30)),
        paymentDate: new Date(now.getTime() - daysToMs(30)),
        method: "DEBIT_CARD" as const,
      },
    ],
  },
  {
    name: "Diego",
    surname: "Sosa",
    email: "diego.sosa@example.com",
    phone: "1167890123",
    docNumber: "29555666",
    birthDate: new Date("1992-09-30"),
    memberStatus: "ACTIVE" as const,
    planName: "Básico",
    membershipStatus: "EXPIRED" as const,
    paymentsHistory: [
      {
        periodStart: new Date(now.getTime() - daysToMs(90)),
        periodEnd: new Date(now.getTime() - daysToMs(60)),
        paymentDate: new Date(now.getTime() - daysToMs(90)),
        method: "CASH" as const,
      },
      {
        periodStart: new Date(now.getTime() - daysToMs(60)),
        periodEnd: new Date(now.getTime() - daysToMs(30)),
        paymentDate: new Date(now.getTime() - daysToMs(60)),
        method: "CASH" as const,
      },
    ],
  },
];

const classSchedules = [
  {
    name: "Spinning Interval",
    description: "Entrenamiento cardiovascular sobre bicicleta fija con intervalos de alta intensidad.",
    category: "SPINNING" as const,
    maxCapacity: 15,
    durationMinutes: 45,
  },
  {
    name: "Crossfit WOD",
    description: "Entrenamiento funcional de alta intensidad combinando fuerza y acondicionamiento.",
    category: "CROSSFIT" as const,
    maxCapacity: 20,
    durationMinutes: 60,
  },
  {
    name: "Yoga Vinyasa",
    description: "Secuencias dinámicas de posturas coordinadas con la respiración y flexibilidad.",
    category: "YOGA" as const,
    maxCapacity: 12,
    durationMinutes: 60,
  },
  {
    name: "Pilates Mat",
    description: "Fortalecimiento del core y reeducación postural mediante ejercicios en colchoneta.",
    category: "PILATES" as const,
    maxCapacity: 10,
    durationMinutes: 50,
  },
  {
    name: "Entrenamiento Funcional",
    description: "Circuitos de fuerza, coordinación y agilidad adaptados a movimientos naturales.",
    category: "FUNCTIONAL" as const,
    maxCapacity: 18,
    durationMinutes: 55,
  },
  {
    name: "HIIT Cardio",
    description: "Intervalos intensos con descansos cortos para acelerar el metabolismo y quemar grasa.",
    category: "HIIT" as const,
    maxCapacity: 16,
    durationMinutes: 45,
  },
];

const getSessionDate = (dayOffset: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() + dayOffset);
  date.setHours(0, 0, 0, 0);
  return date;
};

const classSessionsData = [
  {
    scheduleName: "Spinning Interval",
    date: getSessionDate(1),
    startTime: "08:00",
    status: "SCHEDULED" as const,
    bookings: [
      { memberEmail: "juan.perez@example.com", status: "CONFIRMED" as const },
      { memberEmail: "maria.gomez@example.com", status: "CONFIRMED" as const },
    ],
  },
  {
    scheduleName: "Crossfit WOD",
    date: getSessionDate(1),
    startTime: "18:00",
    status: "SCHEDULED" as const,
    bookings: [
      { memberEmail: "carlos.fernandez@example.com", status: "CONFIRMED" as const },
      { memberEmail: "maria.gomez@example.com", status: "CONFIRMED" as const },
    ],
  },
  {
    scheduleName: "Yoga Vinyasa",
    date: getSessionDate(1),
    startTime: "19:30",
    status: "SCHEDULED" as const,
    bookings: [
      { memberEmail: "juan.perez@example.com", status: "CONFIRMED" as const },
      { memberEmail: "carlos.fernandez@example.com", status: "CANCELLED" as const },
    ],
  },
  {
    scheduleName: "Entrenamiento Funcional",
    date: getSessionDate(2),
    startTime: "09:00",
    status: "SCHEDULED" as const,
    bookings: [
      { memberEmail: "carlos.fernandez@example.com", status: "CONFIRMED" as const },
    ],
  },
  {
    scheduleName: "Pilates Mat",
    date: getSessionDate(2),
    startTime: "17:00",
    status: "SCHEDULED" as const,
    bookings: [],
  },
  {
    scheduleName: "HIIT Cardio",
    date: getSessionDate(2),
    startTime: "19:00",
    status: "SCHEDULED" as const,
    bookings: [
      { memberEmail: "juan.perez@example.com", status: "CONFIRMED" as const },
    ],
  },
  {
    scheduleName: "Spinning Interval",
    date: getSessionDate(3),
    startTime: "08:30",
    status: "SCHEDULED" as const,
    bookings: [
      { memberEmail: "maria.gomez@example.com", status: "CONFIRMED" as const },
    ],
  },
  {
    scheduleName: "Crossfit WOD",
    date: getSessionDate(3),
    startTime: "20:00",
    status: "CANCELLED" as const,
    bookings: [],
  },
];

async function main() {
  console.log("Seeding database...");

  // 1. Membership Plans
  console.log("Seeding membership plans...");
  const plansByName = new Map<string, { id: number; price: number }>();
  for (const plan of membershipPlans) {
    const existing = await prisma.membershipPlan.findFirst({
      where: { name: plan.name },
    });
    const created =
      existing ?? (await prisma.membershipPlan.create({ data: plan }));
    plansByName.set(created.name, { id: created.id, price: created.price });
  }

  // 2. Members, Memberships & Payments
  console.log("Seeding members, memberships and payments...");
  const membersByEmail = new Map<string, number>();

  for (const memberData of members) {
    const planInfo = plansByName.get(memberData.planName);
    if (!planInfo) {
      throw new Error(`Plan not found: ${memberData.planName}`);
    }

    const sortedPayments = [...memberData.paymentsHistory].sort(
      (a, b) => a.periodStart.getTime() - b.periodStart.getTime(),
    );
    const startDate = sortedPayments[0].periodStart;
    const endDate = sortedPayments[sortedPayments.length - 1].periodEnd;

    const existingMember = await prisma.member.findUnique({
      where: { email: memberData.email },
      include: { membership: true },
    });

    let memberId: number;

    if (existingMember) {
      memberId = existingMember.id;
      await prisma.member.update({
        where: { id: existingMember.id },
        data: {
          name: memberData.name,
          surname: memberData.surname,
          phone: memberData.phone,
          docNumber: memberData.docNumber,
          birthDate: memberData.birthDate,
          status: memberData.memberStatus,
        },
      });

      if (existingMember.membership) {
        await prisma.payment.deleteMany({
          where: { membershipId: existingMember.membership.id },
        });

        await prisma.membership.update({
          where: { id: existingMember.membership.id },
          data: {
            startDate,
            endDate,
            status: memberData.membershipStatus,
            membershipPlanId: planInfo.id,
            payments: {
              create: sortedPayments.map((p) => ({
                amount: planInfo.price,
                method: p.method,
                paymentDate: p.paymentDate,
                periodStart: p.periodStart,
                periodEnd: p.periodEnd,
              })),
            },
          },
        });
      } else {
        await prisma.membership.create({
          data: {
            memberId: existingMember.id,
            startDate,
            endDate,
            status: memberData.membershipStatus,
            membershipPlanId: planInfo.id,
            payments: {
              create: sortedPayments.map((p) => ({
                amount: planInfo.price,
                method: p.method,
                paymentDate: p.paymentDate,
                periodStart: p.periodStart,
                periodEnd: p.periodEnd,
              })),
            },
          },
        });
      }
    } else {
      const createdMember = await prisma.member.create({
        data: {
          name: memberData.name,
          surname: memberData.surname,
          email: memberData.email,
          phone: memberData.phone,
          docNumber: memberData.docNumber,
          birthDate: memberData.birthDate,
          status: memberData.memberStatus,
          membership: {
            create: {
              startDate,
              endDate,
              status: memberData.membershipStatus,
              membershipPlanId: planInfo.id,
              payments: {
                create: sortedPayments.map((p) => ({
                  amount: planInfo.price,
                  method: p.method,
                  paymentDate: p.paymentDate,
                  periodStart: p.periodStart,
                  periodEnd: p.periodEnd,
                })),
              },
            },
          },
        },
      });
      memberId = createdMember.id;
    }

    membersByEmail.set(memberData.email, memberId);
  }

  // 3. Class Schedules
  console.log("Seeding class schedules...");
  const schedulesByName = new Map<
    string,
    { id: number; maxCapacity: number }
  >();

  for (const schedule of classSchedules) {
    const existing = await prisma.classSchedule.findFirst({
      where: { name: schedule.name },
    });

    const created = existing
      ? await prisma.classSchedule.update({
          where: { id: existing.id },
          data: {
            ...schedule,
            deletedAt: null,
          },
        })
      : await prisma.classSchedule.create({ data: schedule });

    schedulesByName.set(created.name, {
      id: created.id,
      maxCapacity: created.maxCapacity,
    });
  }

  // 4. Class Sessions & Bookings
  console.log("Seeding class sessions and bookings...");
  const seededScheduleIds = Array.from(schedulesByName.values()).map(
    (s) => s.id,
  );

  // Clean previous bookings and sessions belonging to these schedules to keep seed fresh & idempotent
  await prisma.classBooking.deleteMany({
    where: {
      classSession: {
        classScheduleId: { in: seededScheduleIds },
      },
    },
  });

  await prisma.classSession.deleteMany({
    where: {
      classScheduleId: { in: seededScheduleIds },
    },
  });

  for (const sessionData of classSessionsData) {
    const scheduleInfo = schedulesByName.get(sessionData.scheduleName);
    if (!scheduleInfo) {
      throw new Error(`Schedule not found: ${sessionData.scheduleName}`);
    }

    const confirmedCount = sessionData.bookings.filter(
      (b) => b.status === "CONFIRMED",
    ).length;
    const remainingCapacity = scheduleInfo.maxCapacity - confirmedCount;

    // Note: instructorId is deliberately omitted/null because instructor module is currently legacy
    const createdSession = await prisma.classSession.create({
      data: {
        classScheduleId: scheduleInfo.id,
        instructorId: null,
        date: sessionData.date,
        startTime: sessionData.startTime,
        remainingCapacity,
        status: sessionData.status,
      },
    });

    for (const booking of sessionData.bookings) {
      const memberId = membersByEmail.get(booking.memberEmail);
      if (!memberId) {
        throw new Error(`Member not found: ${booking.memberEmail}`);
      }

      await prisma.classBooking.create({
        data: {
          memberId,
          classSessionId: createdSession.id,
          status: booking.status,
          bookingDate: new Date(sessionData.date.getTime() - daysToMs(1)),
        },
      });
    }
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
