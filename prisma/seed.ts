/// <reference types="node" />  // Para ignorar el error de "Cannot find name 'process'" en TypeScript, ya que la seed esta fuera del src
import "dotenv/config";
import bcrypt from "bcrypt";
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

const instructors = [
  {
    name: "Gabriel",
    surname: "Martínez",
    email: "gabrielmartinez@gmail.com",
    phone: "1155443322",
    docNumber: "25111222",
    docType: "DNI" as const,
  },
  {
    name: "Martín",
    surname: "González",
    email: "martingonzales2004@gmail.com",
    phone: "1166778899",
    docNumber: "26333444",
    docType: "DNI" as const,
  },
  {
    name: "Milton",
    surname: "Ramírez",
    email: "mramirez@hotmail.com",
    phone: "1144332211",
    docNumber: "27555666",
    docType: "DNI" as const,
  },
];


const exercisesData = [
  // Pecho
  {
    name: "Press de Banca Plano con Barra",
    description:
      "Ejercicio multiarticular básico para el desarrollo de la fuerza y volumen del pectoral mayor, deltoides anterior y tríceps.",
    muscleGroup: "Pecho",
    difficultyLevel: "INTERMEDIATE" as const,
  },
  {
    name: "Flexiones de Brazos (Lagartijas)",
    description:
      "Ejercicio de peso corporal enfocado en el fortalecimiento del pecho, la cintura escapular y los tríceps.",
    muscleGroup: "Pecho",
    difficultyLevel: "BEGINNER" as const,
  },
  {
    name: "Aperturas con Mancuernas en Banco Plano",
    description:
      "Aislamiento del pectoral que proporciona un estiramiento profundo de las fibras musculares.",
    muscleGroup: "Pecho",
    difficultyLevel: "BEGINNER" as const,
  },
  {
    name: "Press Inclinado con Mancuernas",
    description:
      "Variante en banco a 30-45 grados para enfatizar la porción superior (clavicular) del pecho.",
    muscleGroup: "Pecho",
    difficultyLevel: "INTERMEDIATE" as const,
  },

  // Espalda
  {
    name: "Jalón al Pecho en Polea Alta",
    description:
      "Tracción vertical guiada para construir amplitud en el dorsal ancho y fuerza en la espalda alta.",
    muscleGroup: "Espalda",
    difficultyLevel: "BEGINNER" as const,
  },
  {
    name: "Remo con Barra",
    description:
      "Ejercicio compuesto para ganar grosor y densidad en la espalda media, dorsal, trapecios y romboides.",
    muscleGroup: "Espalda",
    difficultyLevel: "INTERMEDIATE" as const,
  },
  {
    name: "Remo Unilateral con Mancuerna",
    description:
      "Ejercicio de tracción a una mano con apoyo para aislar el dorsal y corregir desbalances de fuerza.",
    muscleGroup: "Espalda",
    difficultyLevel: "BEGINNER" as const,
  },
  {
    name: "Dominadas en Barra Fija",
    description:
      "Tracción vertical de autocarga exigente para dorsal ancho, redondo mayor y flexores de codo.",
    muscleGroup: "Espalda",
    difficultyLevel: "ADVANCED" as const,
  },

  // Piernas
  {
    name: "Sentadilla Goblet con Mancuerna",
    description:
      "Variante de sentadilla frontal con peso al pecho, ideal para aprender el patrón motor y ganar movilidad.",
    muscleGroup: "Piernas",
    difficultyLevel: "BEGINNER" as const,
  },
  {
    name: "Sentadilla Trasera con Barra",
    description:
      "Movimiento clave para hipertrofia y fuerza máxima de cuádriceps, glúteos, aductores y core.",
    muscleGroup: "Piernas",
    difficultyLevel: "INTERMEDIATE" as const,
  },
  {
    name: "Prensa de Piernas 45°",
    description:
      "Trabajo en máquina guiada para cuádriceps y glúteos, permitiendo manejar cargas elevadas con seguridad.",
    muscleGroup: "Piernas",
    difficultyLevel: "BEGINNER" as const,
  },
  {
    name: "Peso Muerto Rumano con Barra",
    description:
      "Ejercicio de bisagra de cadera indispensable para isquiotibiales, glúteos y erectores espinales.",
    muscleGroup: "Piernas",
    difficultyLevel: "INTERMEDIATE" as const,
  },
  {
    name: "Hip Thrust con Barra",
    description:
      "Empuje de cadera sobre banco enfocado en la máxima activación y desarrollo del glúteo mayor.",
    muscleGroup: "Piernas",
    difficultyLevel: "INTERMEDIATE" as const,
  },
  {
    name: "Elevación de Gemelos de Pie",
    description:
      "Ejercicio específico de flexión plantar para fortalecer y desarrollar las pantorrillas (gastrocnemios y sóleo).",
    muscleGroup: "Piernas",
    difficultyLevel: "BEGINNER" as const,
  },

  // Hombros
  {
    name: "Press Militar con Barra",
    description:
      "Empuje vertical estricto para hombros fuertes y estabilidad general del cinturón escapular.",
    muscleGroup: "Hombros",
    difficultyLevel: "INTERMEDIATE" as const,
  },
  {
    name: "Elevaciones Laterales con Mancuernas",
    description:
      "Aislamiento de la cabeza lateral del deltoides para otorgar amplitud y forma redondeada a los hombros.",
    muscleGroup: "Hombros",
    difficultyLevel: "BEGINNER" as const,
  },
  {
    name: "Pájaros con Mancuernas (Deltoides Posterior)",
    description:
      "Ejercicio en inclinación para activar el deltoides posterior y mejorar la postura escapular.",
    muscleGroup: "Hombros",
    difficultyLevel: "BEGINNER" as const,
  },

  // Brazos
  {
    name: "Curl de Bíceps con Barra Z",
    description:
      "Flexión de brazos con barra ondulada para proteger las muñecas y potenciar los bíceps braquiales.",
    muscleGroup: "Brazos",
    difficultyLevel: "BEGINNER" as const,
  },
  {
    name: "Extensión de Tríceps en Polea Alta",
    description:
      "Aislamiento de tríceps con cuerda o barra recta para bombeo y definición del brazo.",
    muscleGroup: "Brazos",
    difficultyLevel: "BEGINNER" as const,
  },
  {
    name: "Fondos en Barras Paralelas",
    description:
      "Ejercicio de peso corporal de alta intensidad para tríceps, hombros y pectoral inferior.",
    muscleGroup: "Brazos",
    difficultyLevel: "ADVANCED" as const,
  },

  // Core
  {
    name: "Plancha Abdominal Isométrica",
    description:
      "Sostén estático para desarrollar resistencia en el transverso del abdomen, oblicuos y zona lumbar.",
    muscleGroup: "Core",
    difficultyLevel: "BEGINNER" as const,
  },
  {
    name: "Elevaciones de Piernas Colgado",
    description:
      "Movimiento gimnástico avanzado para fortalecer la porción baja del recto abdominal y flexores de cadera.",
    muscleGroup: "Core",
    difficultyLevel: "ADVANCED" as const,
  },
  {
    name: "Rueda Abdominal (Ab Wheel Rollout)",
    description:
      "Desafío supremo de anti-extensión lumbar para construir un abdomen fuerte y blindado.",
    muscleGroup: "Core",
    difficultyLevel: "ADVANCED" as const,
  },
];

const routineTemplates = [
  {
    name: "Full Body Principiante",
    description:
      "Rutina de cuerpo completo para principiantes. Estimula los principales grupos musculares con movimientos seguros y efectivos (3 días no consecutivos por semana).",
    difficulty: "BEGINNER" as const,
    instructorEmail: "gabrielmartinez@gmail.com",
    exercises: [
      {
        exerciseName: "Sentadilla Goblet con Mancuerna",
        order: 1,
        sets: 3,
        reps: 12,
        weight: 12,
        notes: "Mantener pecho erguido y descender con talones bien apoyados en el suelo",
      },
      {
        exerciseName: "Jalón al Pecho en Polea Alta",
        order: 2,
        sets: 3,
        reps: 12,
        weight: 35,
        notes: "Llevar la barra a la parte superior del pecho con control, sin balancear el tronco",
      },
      {
        exerciseName: "Flexiones de Brazos (Lagartijas)",
        order: 3,
        sets: 3,
        reps: 10,
        weight: 0,
        notes: "Apoyar las rodillas si no se llega a 10 repeticiones completas manteniendo buena forma",
      },
      {
        exerciseName: "Elevaciones Laterales con Mancuernas",
        order: 4,
        sets: 3,
        reps: 15,
        weight: 5,
        notes: "Codos semiflexionados, subir hasta la altura de los hombros de forma controlada",
      },
      {
        exerciseName: "Plancha Abdominal Isométrica",
        order: 5,
        sets: 3,
        reps: 40,
        weight: 0,
        notes: "Sostener la posición 40 segundos manteniendo cuerpo recto y core activado",
      },
    ],
  },
  {
    name: "Torso Hipertrofia Intermedio",
    description:
      "Rutina modelo de tren superior para fuerza e hipertrofia en pecho, espalda, hombros y brazos mediante sobrecarga progresiva. Para nivel intermedio.",
    difficulty: "INTERMEDIATE" as const,
    instructorEmail: "martingonzales2004@gmail.com",
    exercises: [
      {
        exerciseName: "Press de Banca Plano con Barra",
        order: 1,
        sets: 4,
        reps: 8,
        weight: 60,
        notes: "Retraer escápulas activamente y controlar la bajada hasta rozar el pecho",
      },
      {
        exerciseName: "Remo con Barra",
        order: 2,
        sets: 4,
        reps: 10,
        weight: 50,
        notes: "Tronco inclinado a 45 grados, traccionar llevando los codos hacia la cadera",
      },
      {
        exerciseName: "Press Militar con Barra",
        order: 3,
        sets: 4,
        reps: 8,
        weight: 35,
        notes: "Core y glúteos firmes en todo momento, evitar arquear la zona lumbar",
      },
      {
        exerciseName: "Curl de Bíceps con Barra Z",
        order: 4,
        sets: 3,
        reps: 12,
        weight: 25,
        notes: "Codos pegados a los costados, controlar la bajada en 2 segundos",
      },
      {
        exerciseName: "Extensión de Tríceps en Polea Alta",
        order: 5,
        sets: 3,
        reps: 12,
        weight: 25,
        notes: "Abrir la cuerda al final de la extensión para mayor contracción del tríceps",
      },
    ],
  },
  {
    name: "Pierna y Potencia Avanzado",
    description:
      "Rutina avanzada para tren inferior y cadena posterior. Enfocada en atletas que buscan máxima fuerza, densidad muscular y potencia funcional en movimientos pesados.",
    difficulty: "ADVANCED" as const,
    instructorEmail: "mramirez@hotmail.com",
    exercises: [
      {
        exerciseName: "Sentadilla Trasera con Barra",
        order: 1,
        sets: 5,
        reps: 5,
        weight: 100,
        notes: "Sentadilla profunda controlada con técnica estricta. Descanso de 2 a 3 minutos entre series",
      },
      {
        exerciseName: "Peso Muerto Rumano con Barra",
        order: 2,
        sets: 4,
        reps: 8,
        weight: 80,
        notes: "Bisagra de cadera estirando los isquiotibiales con espalda completamente neutra",
      },
      {
        exerciseName: "Hip Thrust con Barra",
        order: 3,
        sets: 4,
        reps: 10,
        weight: 90,
        notes: "Pausa isométrica de 1 segundo arriba contrayendo glúteos fuertemente",
      },
      {
        exerciseName: "Prensa de Piernas 45°",
        order: 4,
        sets: 3,
        reps: 12,
        weight: 160,
        notes: "Bajar profundo sin despegar la zona lumbar del respaldo, no bloquear rodillas arriba",
      },
      {
        exerciseName: "Elevaciones de Piernas Colgado",
        order: 5,
        sets: 3,
        reps: 12,
        weight: 0,
        notes: "Subir piernas extendidas hasta la horizontal sin impulsarse con el cuerpo",
      },
    ],
  },
];

async function main() {
  console.log("Seeding database...");

  // 0. Demo users
  console.log("Seeding demo users...");
  const demoAccounts = [
    { email: "admin@gym.com", password: "admin1234", role: "ADMIN" },
    {
      email: "gabrielmartinez@gmail.com",
      password: "instructor1234",
      role: "INSTRUCTOR",
    },
    {
      email: "juan.perez@example.com",
      password: "member1234",
      role: "MEMBER",
    },
  ] as const;

  for (const account of demoAccounts) {
    const passwordHash = await bcrypt.hash(account.password, 10);
    await prisma.user.upsert({
      where: { email: account.email },
      update: {
        passwordHash,
        role: account.role,
        accountStatus: "ACTIVE",
        isActive: true,
      },
      create: {
        email: account.email,
        passwordHash,
        role: account.role,
        accountStatus: "ACTIVE",
        isActive: true,
      },
    });
  }

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

    let user = await prisma.user.findUnique({
      where: { email: memberData.email },
      include: { member: { include: { membership: true } } },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: memberData.email,
          role: "MEMBER",
          accountStatus: "PENDING_ACTIVATION",
          passwordHash: null,
          isActive: true,
        },
        include: { member: { include: { membership: true } } },
      });
    }

    const existingMember = user.member;
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
          phone: memberData.phone,
          docNumber: memberData.docNumber,
          birthDate: memberData.birthDate,
          status: memberData.memberStatus,
          userId: user.id,
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

  // 5. Instructors
  console.log("Seeding instructors...");
  const instructorsByEmail = new Map<string, number>();

  for (const instructorData of instructors) {
    let user = await prisma.user.findUnique({
      where: { email: instructorData.email },
      include: { instructor: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: instructorData.email,
          role: "INSTRUCTOR",
          accountStatus: "PENDING_ACTIVATION",
          passwordHash: null,
          isActive: true,
        },
        include: { instructor: true },
      });
    }

    const existingInstructor = user.instructor;
    let instructorId: number;

    if (existingInstructor) {
      instructorId = existingInstructor.id;
      await prisma.instructor.update({
        where: { id: existingInstructor.id },
        data: {
          name: instructorData.name,
          surname: instructorData.surname,
          phone: instructorData.phone,
          docNumber: instructorData.docNumber,
          docType: instructorData.docType,
          deletedAt: null,
        },
      });
    } else {
      const created = await prisma.instructor.create({
        data: {
          name: instructorData.name,
          surname: instructorData.surname,
          phone: instructorData.phone,
          docNumber: instructorData.docNumber,
          docType: instructorData.docType,
          userId: user.id,
        },
      });
      instructorId = created.id;
    }

    instructorsByEmail.set(instructorData.email, instructorId);
  }


  // 6. Exercises
  console.log("Seeding exercises...");
  const exercisesByName = new Map<string, number>();

  for (const exerciseData of exercisesData) {
    const existing = await prisma.exercise.findFirst({
      where: {
        name: exerciseData.name,
        muscleGroup: exerciseData.muscleGroup,
      },
    });

    const savedExercise = existing
      ? await prisma.exercise.update({
          where: { id: existing.id },
          data: {
            description: exerciseData.description,
            difficultyLevel: exerciseData.difficultyLevel,
            deletedAt: null,
          },
        })
      : await prisma.exercise.create({
          data: exerciseData,
        });

    exercisesByName.set(savedExercise.name, savedExercise.id);
  }

  // 7. Routine Templates & Exercises
  console.log("Seeding routine templates and exercises...");
  for (const template of routineTemplates) {
    const instructorId = instructorsByEmail.get(template.instructorEmail);
    if (!instructorId) {
      throw new Error(
        `Instructor not found for template: ${template.instructorEmail}`,
      );
    }

    const existingRoutine = await prisma.routine.findFirst({
      where: { name: template.name },
    });

    let routineId: number;

    if (existingRoutine) {
      routineId = existingRoutine.id;
      await prisma.routine.update({
        where: { id: routineId },
        data: {
          description: template.description,
          difficulty: template.difficulty,
          instructorId,
          deletedAt: null,
        },
      });

      // Clear previous routine exercises to keep seed idempotent
      await prisma.routineExercise.deleteMany({
        where: { routineId },
      });
    } else {
      const createdRoutine = await prisma.routine.create({
        data: {
          name: template.name,
          description: template.description,
          difficulty: template.difficulty,
          instructorId,
        },
      });
      routineId = createdRoutine.id;
    }

    for (const ex of template.exercises) {
      const exerciseId = exercisesByName.get(ex.exerciseName);
      if (!exerciseId) {
        throw new Error(`Exercise not found: ${ex.exerciseName}`);
      }

      await prisma.routineExercise.create({
        data: {
          routineId,
          exerciseId,
          order: ex.order,
          reps: ex.reps,
          sets: ex.sets,
          weight: ex.weight,
          notes: ex.notes,
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
