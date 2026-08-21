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

const members = [
  {
    name: "Juan",
    surname: "Pérez",
    email: "juan.perez@example.com",
    phone: "1123456789",
    docNumber: "30111222",
    birthDate: new Date("1990-05-12"),
    planName: "Básico",
    lastPaymentMethod: "CASH" as const,
  },
  {
    name: "María",
    surname: "Gómez",
    email: "maria.gomez@example.com",
    phone: "1134567890",
    docNumber: "32222333",
    birthDate: new Date("1988-11-03"),
    planName: "Plus",
    lastPaymentMethod: "CREDIT_CARD" as const,
  },
  {
    name: "Carlos",
    surname: "Fernández",
    email: "carlos.fernandez@example.com",
    phone: "1145678901",
    docNumber: "28333444",
    birthDate: new Date("1995-02-20"),
    planName: "Premium",
    lastPaymentMethod: "TRANSFER" as const,
  },
  {
    name: "Lucía",
    surname: "Martínez",
    email: "lucia.martinez@example.com",
    phone: "1156789012",
    docNumber: "35444555",
    birthDate: new Date("1999-07-08"),
    planName: "Plus",
    lastPaymentMethod: "DEBIT_CARD" as const,
  },
  {
    name: "Diego",
    surname: "Sosa",
    email: "diego.sosa@example.com",
    phone: "1167890123",
    docNumber: "29555666",
    birthDate: new Date("1992-09-30"),
    planName: "Básico",
    lastPaymentMethod: "CASH" as const,
  },
];

async function main() {
  console.log("Seeding database...");

  const plansByName = new Map<string, number>();
  for (const plan of membershipPlans) {
    const existing = await prisma.membershipPlan.findFirst({
      where: { name: plan.name },
    });
    const created =
      existing ?? (await prisma.membershipPlan.create({ data: plan }));
    plansByName.set(created.name, created.id);
  }

  for (const member of members) {
    const planId = plansByName.get(member.planName);
    if (!planId) {
      throw new Error(`Plan not found: ${member.planName}`);
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30);

    await prisma.member.upsert({
      where: { email: member.email },
      update: {},
      create: {
        name: member.name,
        surname: member.surname,
        email: member.email,
        phone: member.phone,
        docNumber: member.docNumber,
        birthDate: member.birthDate,
        membership: {
          create: {
            startDate,
            endDate,
            lastPaymentMethod: member.lastPaymentMethod,
            lastPaymentDate: startDate,
            membershipPlanId: planId,
          },
        },
      },
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
