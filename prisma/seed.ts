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
    planName: "Básico",
    status: "ACTIVE" as const,
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
    planName: "Plus",
    status: "ACTIVE" as const,
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
    planName: "Premium",
    status: "ACTIVE" as const,
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
    planName: "Plus",
    status: "SUSPENDED" as const,
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
    planName: "Básico",
    status: "ACTIVE" as const,
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

async function main() {
  console.log("Seeding database...");

  const plansByName = new Map<string, { id: number; price: number }>();
  for (const plan of membershipPlans) {
    const existing = await prisma.membershipPlan.findFirst({
      where: { name: plan.name },
    });
    const created =
      existing ?? (await prisma.membershipPlan.create({ data: plan }));
    plansByName.set(created.name, { id: created.id, price: created.price });
  }

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

    if (existingMember) {
      if (existingMember.membership) {
        await prisma.payment.deleteMany({
          where: { membershipId: existingMember.membership.id },
        });

        await prisma.membership.update({
          where: { id: existingMember.membership.id },
          data: {
            startDate,
            endDate,
            status: memberData.status,
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
      await prisma.member.create({
        data: {
          name: memberData.name,
          surname: memberData.surname,
          email: memberData.email,
          phone: memberData.phone,
          docNumber: memberData.docNumber,
          birthDate: memberData.birthDate,
          membership: {
            create: {
              startDate,
              endDate,
              status: memberData.status,
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
