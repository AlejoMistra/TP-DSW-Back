/// <reference types="node" />
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

const now = new Date();
const daysToMs = (days: number) => days * 24 * 60 * 60 * 1000;

/**
 * Retorna una fecha normalizada en UTC (00:00:00) relativa al día de hoy.
 * Permite que los dashboards ("Agenda de hoy", "Mis clases a dictar", próximas sesiones)
 * muestren datos siempre vigentes y dinámicos al momento de ejecutar la seed.
 */
const getRelativeDate = (dayOffset: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() + dayOffset);
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0));
};

// ============================================================================
// 1. PLANES DE MEMBRESÍA
// ============================================================================
const membershipPlans = [
  {
    name: "Básico",
    description: "Acceso total a la sala de musculación y máquinas cardiovasculares en horario completo.",
    price: 28000,
    durationDays: 30,
  },
  {
    name: "Plus",
    description: "Acceso a musculación + todas las clases grupales (Spinning, Funcional, Yoga, Pilates, Crossfit).",
    price: 36000,
    durationDays: 30,
  },
  {
    name: "Premium",
    description: "Acceso ilimitado a todas las instalaciones, clases grupales y seguimiento personalizado con instructor.",
    price: 49000,
    durationDays: 30,
  },
  {
    name: "Pase Trimestral",
    description: "Acceso completo durante 3 meses con tarifa bonificada especial (15% de descuento).",
    price: 95000,
    durationDays: 90,
  },
];

// ============================================================================
// 2. CUENTAS DE USUARIO Y PERFILES
// ============================================================================

// A) Administrador
const adminAccount = {
  email: "admin@gym.com",
  password: "admin1234",
  role: "ADMIN" as const,
};

// B) Instructores
const instructorsData = [
  {
    name: "Gabriel",
    surname: "Martínez",
    email: "gabrielmartinez@gmail.com",
    password: "instructor1234",
    phone: "1155443322",
    docNumber: "25111222",
    docType: "DNI" as const,
  },
  {
    name: "Martín",
    surname: "González",
    email: "martingonzales2004@gmail.com",
    password: "instructor1234",
    phone: "1166778899",
    docNumber: "26333444",
    docType: "DNI" as const,
  },
  {
    name: "Milton",
    surname: "Ramírez",
    email: "mramirez@hotmail.com",
    password: "instructor1234",
    phone: "1144332211",
    docNumber: "27555666",
    docType: "DNI" as const,
  },
];

// C) Socios (con diferentes estados para probar todas las pantallas y dashboards)
const membersData = [
  {
    name: "Juan",
    surname: "Pérez",
    email: "juan.perez@example.com",
    password: "member1234",
    phone: "1123456789",
    docNumber: "30111222",
    docType: "DNI" as const,
    birthDate: new Date("1990-05-12"),
    userAccountStatus: "ACTIVE" as const,
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
    password: "member1234",
    phone: "1134567890",
    docNumber: "32222333",
    docType: "DNI" as const,
    birthDate: new Date("1988-11-03"),
    userAccountStatus: "ACTIVE" as const,
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
    password: "member1234",
    phone: "1145678901",
    docNumber: "28333444",
    docType: "DNI" as const,
    birthDate: new Date("1995-02-20"),
    userAccountStatus: "ACTIVE" as const,
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
    // Socio con membresía VENCIDA -> Se visualiza en el panel de Membresías Vencidas del Admin
    name: "Diego",
    surname: "Sosa",
    email: "diego.sosa@example.com",
    password: "member1234",
    phone: "1167890123",
    docNumber: "29555666",
    docType: "DNI" as const,
    birthDate: new Date("1992-09-30"),
    userAccountStatus: "ACTIVE" as const,
    memberStatus: "ACTIVE" as const,
    planName: "Básico",
    membershipStatus: "EXPIRED" as const,
    paymentsHistory: [
      {
        periodStart: new Date(now.getTime() - daysToMs(75)),
        periodEnd: new Date(now.getTime() - daysToMs(45)),
        paymentDate: new Date(now.getTime() - daysToMs(75)),
        method: "CASH" as const,
      },
      {
        periodStart: new Date(now.getTime() - daysToMs(45)),
        // Venció hace 15 días:
        periodEnd: new Date(now.getTime() - daysToMs(15)),
        paymentDate: new Date(now.getTime() - daysToMs(45)),
        method: "CASH" as const,
      },
    ],
  },
  {
    // Socia INACTIVA con membresía CANCELADA -> Para probar filtros de inactivos
    name: "Lucía",
    surname: "Martínez",
    email: "lucia.martinez@example.com",
    password: "member1234",
    phone: "1156789012",
    docNumber: "35444555",
    docType: "DNI" as const,
    birthDate: new Date("1999-07-08"),
    userAccountStatus: "ACTIVE" as const,
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
    // Socio PENDIENTE DE ACTIVACIÓN (sin contraseña aún)
    name: "Valentín",
    surname: "Torres",
    email: "valentin.torres@example.com",
    password: null,
    phone: "1178901234",
    docNumber: "38999000",
    docType: "DNI" as const,
    birthDate: new Date("2001-04-18"),
    userAccountStatus: "PENDING_ACTIVATION" as const,
    memberStatus: "ACTIVE" as const,
    planName: "Básico",
    membershipStatus: "ACTIVE" as const,
    paymentsHistory: [
      {
        periodStart: new Date(now.getTime()),
        periodEnd: new Date(now.getTime() + daysToMs(30)),
        paymentDate: new Date(now.getTime()),
        method: "TRANSFER" as const,
      },
    ],
  },
];

// ============================================================================
// 3. TIPOS DE CLASE (CLASS SCHEDULES)
// ============================================================================
const classSchedules = [
  {
    name: "Spinning Interval",
    description: "Entrenamiento cardiovascular sobre bicicleta fija con intervalos de alta intensidad y ritmo musical.",
    category: "SPINNING" as const,
    maxCapacity: 15,
    durationMinutes: 45,
  },
  {
    name: "Crossfit WOD",
    description: "Entrenamiento funcional de alta intensidad combinando fuerza, levantamiento olímpico y acondicionamiento.",
    category: "CROSSFIT" as const,
    maxCapacity: 20,
    durationMinutes: 60,
  },
  {
    name: "Yoga Vinyasa",
    description: "Secuencias dinámicas de posturas coordinadas con respiración consciente, equilibrio y flexibilidad.",
    category: "YOGA" as const,
    maxCapacity: 12,
    durationMinutes: 60,
  },
  {
    name: "Pilates Mat",
    description: "Fortalecimiento del core, movilidad articular y reeducación postural mediante trabajo en colchoneta.",
    category: "PILATES" as const,
    maxCapacity: 10,
    durationMinutes: 50,
  },
  {
    name: "Entrenamiento Funcional",
    description: "Circuitos de fuerza, coordinación y agilidad orientados a patrones de movimiento del día a día.",
    category: "FUNCTIONAL" as const,
    maxCapacity: 18,
    durationMinutes: 55,
  },
  {
    name: "HIIT Cardio",
    description: "Intervalos explosivos con descansos cortos para acelerar el metabolismo y maximizar la quema calórica.",
    category: "HIIT" as const,
    maxCapacity: 16,
    durationMinutes: 45,
  },
  {
    name: "Stretching & Movilidad",
    description: "Sesión relajante de elongación guiada, descomcompresión de columna y mejora de rango articular.",
    category: "STRETCHING" as const,
    maxCapacity: 14,
    durationMinutes: 45,
  },
];

// ============================================================================
// 4. BANCO DE EJERCICIOS (PARA CATALOGO Y CREACIÓN DE RUTINAS)
// ============================================================================
const exercisesData = [
  // --- PECHO ---
  {
    name: "Press de Banca Plano con Barra",
    description: "Ejercicio multiarticular básico para el desarrollo de la fuerza y volumen del pectoral mayor, deltoides anterior y tríceps.",
    muscleGroup: "Pecho",
    difficultyLevel: "INTERMEDIATE" as const,
  },
  {
    name: "Flexiones de Brazos (Lagartijas)",
    description: "Ejercicio de peso corporal enfocado en el fortalecimiento del pecho, la cintura escapular y los tríceps.",
    muscleGroup: "Pecho",
    difficultyLevel: "BEGINNER" as const,
  },
  {
    name: "Aperturas con Mancuernas en Banco Plano",
    description: "Aislamiento del pectoral que proporciona un estiramiento profundo de las fibras musculares.",
    muscleGroup: "Pecho",
    difficultyLevel: "BEGINNER" as const,
  },
  {
    name: "Press Inclinado con Mancuernas",
    description: "Variante en banco a 30-45 grados para enfatizar la porción superior (clavicular) del pecho.",
    muscleGroup: "Pecho",
    difficultyLevel: "INTERMEDIATE" as const,
  },
  {
    name: "Fondos en Paralelas para Pecho",
    description: "Inclinando el torso hacia adelante para enfatizar el trabajo en la porción inferior del pectoral y tríceps.",
    muscleGroup: "Pecho",
    difficultyLevel: "ADVANCED" as const,
  },
  {
    name: "Cruce de Poleas Altas",
    description: "Excelente ejercicio de contracción y congestión continua para la parte baja y esternal del pectoral.",
    muscleGroup: "Pecho",
    difficultyLevel: "BEGINNER" as const,
  },

  // --- ESPALDA ---
  {
    name: "Jalón al Pecho en Polea Alta",
    description: "Tracción vertical guiada para construir amplitud en el dorsal ancho y fuerza en la espalda alta.",
    muscleGroup: "Espalda",
    difficultyLevel: "BEGINNER" as const,
  },
  {
    name: "Remo con Barra",
    description: "Ejercicio compuesto para ganar grosor y densidad en la espalda media, dorsal, trapecios y romboides.",
    muscleGroup: "Espalda",
    difficultyLevel: "INTERMEDIATE" as const,
  },
  {
    name: "Remo Unilateral con Mancuerna",
    description: "Ejercicio de tracción a una mano con apoyo en banco para aislar el dorsal y corregir desbalances de fuerza.",
    muscleGroup: "Espalda",
    difficultyLevel: "BEGINNER" as const,
  },
  {
    name: "Dominadas en Barra Fija",
    description: "Tracción vertical de autocarga exigente para dorsal ancho, redondo mayor y flexores de codo.",
    muscleGroup: "Espalda",
    difficultyLevel: "ADVANCED" as const,
  },
  {
    name: "Remo en Polea Baja (Gironda)",
    description: "Tracción horizontal con agarre estrecho para desarrollar el grosor de la espalda media y dorsal bajo.",
    muscleGroup: "Espalda",
    difficultyLevel: "BEGINNER" as const,
  },
  {
    name: "Hiperextensiones Lumbares",
    description: "Fortalecimiento de la zona lumbar, erectores espinales, glúteos e isquiotibiales con control postural.",
    muscleGroup: "Espalda",
    difficultyLevel: "BEGINNER" as const,
  },

  // --- PIERNAS ---
  {
    name: "Sentadilla Goblet con Mancuerna",
    description: "Variante de sentadilla frontal con peso al pecho, ideal para aprender el patrón motor y ganar movilidad.",
    muscleGroup: "Piernas",
    difficultyLevel: "BEGINNER" as const,
  },
  {
    name: "Sentadilla Trasera con Barra",
    description: "Movimiento clave para hipertrofia y fuerza máxima de cuádriceps, glúteos, aductores y core.",
    muscleGroup: "Piernas",
    difficultyLevel: "INTERMEDIATE" as const,
  },
  {
    name: "Prensa de Piernas 45°",
    description: "Trabajo en máquina guiada para cuádriceps y glúteos, permitiendo manejar cargas elevadas con seguridad.",
    muscleGroup: "Piernas",
    difficultyLevel: "BEGINNER" as const,
  },
  {
    name: "Peso Muerto Rumano con Barra",
    description: "Ejercicio de bisagra de cadera indispensable para isquiotibiales, glúteos y erectores espinales.",
    muscleGroup: "Piernas",
    difficultyLevel: "INTERMEDIATE" as const,
  },
  {
    name: "Hip Thrust con Barra",
    description: "Empuje de cadera sobre banco enfocado en la máxima activación y desarrollo del glúteo mayor.",
    muscleGroup: "Piernas",
    difficultyLevel: "INTERMEDIATE" as const,
  },
  {
    name: "Elevación de Gemelos de Pie",
    description: "Ejercicio específico de flexión plantar para fortalecer y desarrollar las pantorrillas (gastrocnemios y sóleo).",
    muscleGroup: "Piernas",
    difficultyLevel: "BEGINNER" as const,
  },
  {
    name: "Sentadilla Búlgara con Mancuernas",
    description: "Trabajo unilateral intenso para cuádriceps y glúteos, mejorando la estabilidad y fuerza simétrica.",
    muscleGroup: "Piernas",
    difficultyLevel: "ADVANCED" as const,
  },
  {
    name: "Extensión de Cuádriceps en Máquina",
    description: "Aislamiento analítico para fortalecer cuádriceps y ligamentos de la rodilla con tensión constante.",
    muscleGroup: "Piernas",
    difficultyLevel: "BEGINNER" as const,
  },

  // --- HOMBROS ---
  {
    name: "Press Militar con Barra",
    description: "Empuje vertical estricto para hombros fuertes y estabilidad general del cinturón escapular.",
    muscleGroup: "Hombros",
    difficultyLevel: "INTERMEDIATE" as const,
  },
  {
    name: "Elevaciones Laterales con Mancuernas",
    description: "Aislamiento de la cabeza lateral del deltoides para otorgar amplitud y forma redondeada a los hombros.",
    muscleGroup: "Hombros",
    difficultyLevel: "BEGINNER" as const,
  },
  {
    name: "Pájaros con Mancuernas (Deltoides Posterior)",
    description: "Ejercicio en inclinación para activar el deltoides posterior y mejorar la postura escapular.",
    muscleGroup: "Hombros",
    difficultyLevel: "BEGINNER" as const,
  },
  {
    name: "Press Arnold con Mancuernas",
    description: "Variante completa con rotación que estimula las tres cabezas del deltoides de forma armónica.",
    muscleGroup: "Hombros",
    difficultyLevel: "INTERMEDIATE" as const,
  },
  {
    name: "Face Pull en Polea Alta",
    description: "Tracción hacia el rostro para deltoides posterior, manguito rotador y salud escapular.",
    muscleGroup: "Hombros",
    difficultyLevel: "BEGINNER" as const,
  },

  // --- BRAZOS ---
  {
    name: "Curl de Bíceps con Barra Z",
    description: "Flexión de brazos con barra ondulada para proteger las muñecas y potenciar los bíceps braquiales.",
    muscleGroup: "Brazos",
    difficultyLevel: "BEGINNER" as const,
  },
  {
    name: "Extensión de Tríceps en Polea Alta",
    description: "Aislamiento de tríceps con cuerda o barra recta para bombeo y definición del brazo.",
    muscleGroup: "Brazos",
    difficultyLevel: "BEGINNER" as const,
  },
  {
    name: "Fondos en Barras Paralelas",
    description: "Ejercicio de peso corporal de alta intensidad para tríceps, hombros y pectoral inferior.",
    muscleGroup: "Brazos",
    difficultyLevel: "ADVANCED" as const,
  },
  {
    name: "Curl Martillo con Mancuernas",
    description: "Agarre neutro que potencia el braquial anterior y braquiorradial, aportando grosor al brazo.",
    muscleGroup: "Brazos",
    difficultyLevel: "BEGINNER" as const,
  },
  {
    name: "Press Francés con Barra Z",
    description: "Extensión en banco plano enfocado en la cabeza larga del tríceps para máxima hipertrofia.",
    muscleGroup: "Brazos",
    difficultyLevel: "INTERMEDIATE" as const,
  },

  // --- CORE ---
  {
    name: "Plancha Abdominal Isométrica",
    description: "Sostén estático para desarrollar resistencia en el transverso del abdomen, oblicuos y zona lumbar.",
    muscleGroup: "Core",
    difficultyLevel: "BEGINNER" as const,
  },
  {
    name: "Elevaciones de Piernas Colgado",
    description: "Movimiento gimnástico avanzado para fortalecer la porción baja del recto abdominal y flexores de cadera.",
    muscleGroup: "Core",
    difficultyLevel: "ADVANCED" as const,
  },
  {
    name: "Rueda Abdominal (Ab Wheel Rollout)",
    description: "Desafío supremo de anti-extensión lumbar para construir un abdomen fuerte y blindado.",
    muscleGroup: "Core",
    difficultyLevel: "ADVANCED" as const,
  },
  {
    name: "Russian Twists con Disco",
    description: "Rotaciones de tronco sentados en equilibrio para trabajar la musculatura oblicua y estabilidad rotacional.",
    muscleGroup: "Core",
    difficultyLevel: "BEGINNER" as const,
  },
];

// ============================================================================
// 5. RUTINAS PREDISEÑADAS VINCULADAS A CADA INSTRUCTOR
// ============================================================================
const routineTemplates = [
  {
    name: "Full Body Principiante",
    description: "Rutina integral de cuerpo completo para quienes dan sus primeros pasos. Estimula los principales grupos musculares con movimientos seguros, controlados y efectivos (3 días no consecutivos por semana).",
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
    description: "Rutina modelo de tren superior para fuerza e hipertrofia en pecho, espalda, hombros y brazos mediante sobrecarga progresiva. Diseñada para nivel intermedio.",
    difficulty: "INTERMEDIATE" as const,
    instructorEmail: "martingonzales2004@gmail.com",
    exercises: [
      {
        exerciseName: "Press de Banca Plano con Barra",
        order: 1,
        sets: 4,
        reps: 8,
        weight: 65,
        notes: "Retraer escápulas activamente y controlar la bajada hasta rozar el pecho",
      },
      {
        exerciseName: "Remo con Barra",
        order: 2,
        sets: 4,
        reps: 10,
        weight: 55,
        notes: "Tronco inclinado a 45 grados, traccionar llevando los codos hacia la cadera",
      },
      {
        exerciseName: "Press Militar con Barra",
        order: 3,
        sets: 4,
        reps: 8,
        weight: 40,
        notes: "Core y glúteos firmes en todo momento, evitar arquear la zona lumbar",
      },
      {
        exerciseName: "Curl de Bíceps con Barra Z",
        order: 4,
        sets: 3,
        reps: 12,
        weight: 27.5,
        notes: "Codos pegados a los costados, controlar la fase excéntrica en 2 segundos",
      },
      {
        exerciseName: "Extensión de Tríceps en Polea Alta",
        order: 5,
        sets: 3,
        reps: 12,
        weight: 30,
        notes: "Abrir la cuerda al final de la extensión para mayor contracción del tríceps",
      },
    ],
  },
  {
    name: "Pierna y Potencia Avanzado",
    description: "Rutina avanzada para tren inferior y cadena posterior. Enfocada en atletas que buscan máxima fuerza, densidad muscular y potencia funcional en movimientos pesados.",
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
        weight: 85,
        notes: "Bisagra de cadera estirando los isquiotibiales con espalda completamente neutra",
      },
      {
        exerciseName: "Hip Thrust con Barra",
        order: 3,
        sets: 4,
        reps: 10,
        weight: 95,
        notes: "Pausa isométrica de 1 segundo arriba contrayendo glúteos fuertemente",
      },
      {
        exerciseName: "Prensa de Piernas 45°",
        order: 4,
        sets: 3,
        reps: 12,
        weight: 170,
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
  {
    name: "Acondicionamiento Funcional & Core",
    description: "Rutina dinámica de circuitos de agilidad, fuerza con autocarga y resistencia del core para mejorar la capacidad aeróbica y tonificación general.",
    difficulty: "INTERMEDIATE" as const,
    instructorEmail: "gabrielmartinez@gmail.com",
    exercises: [
      {
        exerciseName: "Sentadilla Búlgara con Mancuernas",
        order: 1,
        sets: 3,
        reps: 10,
        weight: 10,
        notes: "10 repeticiones por pierna, bajando la rodilla trasera casi hasta tocar el suelo",
      },
      {
        exerciseName: "Remo Unilateral con Mancuerna",
        order: 2,
        sets: 3,
        reps: 12,
        weight: 18,
        notes: "Espalda paralela al suelo, traccionar sin girar el torso",
      },
      {
        exerciseName: "Press Arnold con Mancuernas",
        order: 3,
        sets: 3,
        reps: 12,
        weight: 12,
        notes: "Rotar suavemente de supinación a pronación durante el empuje",
      },
      {
        exerciseName: "Russian Twists con Disco",
        order: 4,
        sets: 3,
        reps: 20,
        weight: 10,
        notes: "10 rotaciones por lado con pies despegados del piso",
      },
      {
        exerciseName: "Rueda Abdominal (Ab Wheel Rollout)",
        order: 5,
        sets: 3,
        reps: 8,
        weight: 0,
        notes: "Extensión lenta y controlada manteniendo la retroversión pélvica",
      },
    ],
  },
];

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================
async function main() {
  console.log("🚀 Iniciando seed de la base de datos de MyGymManager...");

  // --------------------------------------------------------------------------
  // 0. LIMPIEZA PREVIA EN ORDEN INVERSO DE DEPENDENCIAS (IDEMPOTENCIA)
  // --------------------------------------------------------------------------
  console.log("🧹 Limpiando datos de sesiones, reservas y rutinas anteriores...");
  await prisma.classBooking.deleteMany({});
  await prisma.classSession.deleteMany({});
  await prisma.classSessionRecurrence.deleteMany({});
  await prisma.routineExercise.deleteMany({});
  await prisma.routine.deleteMany({});
  await prisma.payment.deleteMany({});

  // --------------------------------------------------------------------------
  // 1. USUARIOS ADMINISTRADOR E INSTRUCTORES
  // --------------------------------------------------------------------------
  console.log("👤 Creando / actualizando cuenta Administrador...");
  const adminPasswordHash = await bcrypt.hash(adminAccount.password, 10);
  await prisma.user.upsert({
    where: { email: adminAccount.email },
    update: {
      passwordHash: adminPasswordHash,
      role: adminAccount.role,
      accountStatus: "ACTIVE",
      isActive: true,
    },
    create: {
      email: adminAccount.email,
      passwordHash: adminPasswordHash,
      role: adminAccount.role,
      accountStatus: "ACTIVE",
      isActive: true,
    },
  });

  console.log("🏋️ Creando / actualizando Instructores...");
  const instructorsByEmail = new Map<string, number>();

  for (const instructorData of instructorsData) {
    const passwordHash = await bcrypt.hash(instructorData.password, 10);
    const user = await prisma.user.upsert({
      where: { email: instructorData.email },
      update: {
        passwordHash,
        role: "INSTRUCTOR",
        accountStatus: "ACTIVE",
        isActive: true,
      },
      create: {
        email: instructorData.email,
        passwordHash,
        role: "INSTRUCTOR",
        accountStatus: "ACTIVE",
        isActive: true,
      },
    });

    const existingInstructor = await prisma.instructor.findUnique({
      where: { userId: user.id },
    });

    let instructorId: number;
    if (existingInstructor) {
      instructorId = existingInstructor.id;
      await prisma.instructor.update({
        where: { id: instructorId },
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

  // --------------------------------------------------------------------------
  // 2. PLANES DE MEMBRESÍA
  // --------------------------------------------------------------------------
  console.log("💳 Creando planes de membresía...");
  const plansByName = new Map<string, { id: number; price: number }>();

  for (const plan of membershipPlans) {
    const existing = await prisma.membershipPlan.findFirst({
      where: { name: plan.name },
    });

    const savedPlan = existing
      ? await prisma.membershipPlan.update({
          where: { id: existing.id },
          data: {
            description: plan.description,
            price: plan.price,
            durationDays: plan.durationDays,
            deletedAt: null,
          },
        })
      : await prisma.membershipPlan.create({ data: plan });

    plansByName.set(savedPlan.name, { id: savedPlan.id, price: savedPlan.price });
  }

  // --------------------------------------------------------------------------
  // 3. SOCIOS, MEMBRESÍAS Y PAGOS
  // --------------------------------------------------------------------------
  console.log("👥 Creando socios, membresías activas/vencidas e historial de pagos...");
  const membersByEmail = new Map<string, number>();

  for (const memberData of membersData) {
    const planInfo = plansByName.get(memberData.planName);
    if (!planInfo) {
      throw new Error(`Plan no encontrado: ${memberData.planName}`);
    }

    const passwordHash = memberData.password
      ? await bcrypt.hash(memberData.password, 10)
      : null;

    const user = await prisma.user.upsert({
      where: { email: memberData.email },
      update: {
        passwordHash,
        role: "MEMBER",
        accountStatus: memberData.userAccountStatus,
        isActive: memberData.memberStatus === "ACTIVE",
      },
      create: {
        email: memberData.email,
        passwordHash,
        role: "MEMBER",
        accountStatus: memberData.userAccountStatus,
        isActive: memberData.memberStatus === "ACTIVE",
      },
    });

    const sortedPayments = [...memberData.paymentsHistory].sort(
      (a, b) => a.periodStart.getTime() - b.periodStart.getTime(),
    );
    const startDate = sortedPayments[0].periodStart;
    const endDate = sortedPayments[sortedPayments.length - 1].periodEnd;

    let member = await prisma.member.findUnique({
      where: { userId: user.id },
      include: { membership: true },
    });

    let memberId: number;
    if (member) {
      memberId = member.id;
      await prisma.member.update({
        where: { id: member.id },
        data: {
          name: memberData.name,
          surname: memberData.surname,
          phone: memberData.phone,
          docNumber: memberData.docNumber,
          docType: memberData.docType,
          birthDate: memberData.birthDate,
          status: memberData.memberStatus,
          deletedAt: null,
        },
      });

      if (member.membership) {
        await prisma.membership.update({
          where: { id: member.membership.id },
          data: {
            startDate,
            endDate,
            status: memberData.membershipStatus,
            membershipPlanId: planInfo.id,
            deletedAt: null,
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
            memberId: member.id,
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
          docType: memberData.docType,
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

  // --------------------------------------------------------------------------
  // 4. TIPOS DE CLASE (CLASS SCHEDULES)
  // --------------------------------------------------------------------------
  console.log("📅 Creando cronograma de tipos de clases...");
  const schedulesByName = new Map<
    string,
    { id: number; maxCapacity: number; durationMinutes: number }
  >();

  for (const schedule of classSchedules) {
    const existing = await prisma.classSchedule.findFirst({
      where: { name: schedule.name },
    });

    const savedSchedule = existing
      ? await prisma.classSchedule.update({
          where: { id: existing.id },
          data: {
            ...schedule,
            deletedAt: null,
          },
        })
      : await prisma.classSchedule.create({ data: schedule });

    schedulesByName.set(savedSchedule.name, {
      id: savedSchedule.id,
      maxCapacity: savedSchedule.maxCapacity,
      durationMinutes: savedSchedule.durationMinutes,
    });
  }

  // --------------------------------------------------------------------------
  // 5. CLASES RECURRENTES (SERIES TIPO GOOGLE CALENDAR) Y SESIONES PUNTUALES
  // --------------------------------------------------------------------------
  console.log("🔁 Creando series de clases recurrentes (ClassSessionRecurrence)...");

  // Serie Recurrente 1: Entrenamiento Funcional los Martes (2) y Jueves (4)
  // Dictada por Martín González a las 18:00
  const functionalSchedule = schedulesByName.get("Entrenamiento Funcional")!;
  const martinId = instructorsByEmail.get("martingonzales2004@gmail.com")!;
  const gabrielId = instructorsByEmail.get("gabrielmartinez@gmail.com")!;
  const miltonId = instructorsByEmail.get("mramirez@hotmail.com")!;

  const recStartDate1 = getRelativeDate(-7);
  const recEndDate1 = getRelativeDate(21);
  const recurrence1 = await prisma.classSessionRecurrence.create({
    data: {
      daysOfWeek: "2,4",
      startDate: recStartDate1,
      endDate: recEndDate1,
    },
  });

  // Generamos sesiones de la serie 1 para todos los Martes (2) y Jueves (4) en el rango
  let curDate = new Date(recStartDate1);
  while (curDate <= recEndDate1) {
    const dayOfWeek = curDate.getUTCDay() === 0 ? 7 : curDate.getUTCDay();
    if (dayOfWeek === 2 || dayOfWeek === 4) {
      await prisma.classSession.create({
        data: {
          classScheduleId: functionalSchedule.id,
          instructorId: martinId,
          recurrenceId: recurrence1.id,
          date: new Date(curDate),
          startTime: "18:00",
          remainingCapacity: functionalSchedule.maxCapacity,
          status: "SCHEDULED",
        },
      });
    }
    curDate.setUTCDate(curDate.getUTCDate() + 1);
  }

  // Serie Recurrente 2: Spinning Interval los Lunes (1) y Miércoles (3)
  // Dictada por Gabriel Martínez a las 08:30
  const spinningSchedule = schedulesByName.get("Spinning Interval")!;
  const recStartDate2 = getRelativeDate(-7);
  const recEndDate2 = getRelativeDate(21);
  const recurrence2 = await prisma.classSessionRecurrence.create({
    data: {
      daysOfWeek: "1,3",
      startDate: recStartDate2,
      endDate: recEndDate2,
    },
  });

  curDate = new Date(recStartDate2);
  while (curDate <= recEndDate2) {
    const dayOfWeek = curDate.getUTCDay() === 0 ? 7 : curDate.getUTCDay();
    if (dayOfWeek === 1 || dayOfWeek === 3) {
      await prisma.classSession.create({
        data: {
          classScheduleId: spinningSchedule.id,
          instructorId: gabrielId,
          recurrenceId: recurrence2.id,
          date: new Date(curDate),
          startTime: "08:30",
          remainingCapacity: spinningSchedule.maxCapacity,
          status: "SCHEDULED",
        },
      });
    }
    curDate.setUTCDate(curDate.getUTCDate() + 1);
  }

  // --------------------------------------------------------------------------
  // 6. SESIONES PUNTUALES DE HOY Y PRÓXIMOS DÍAS CON INSTRUCTORES Y RESERVAS
  // --------------------------------------------------------------------------
  console.log("📆 Creando sesiones puntuales y reservas para el día de hoy y la semana...");

  const standaloneSessionsData = [
    // --- HOY (dayOffset = 0) ---
    // Aparecen en "Agenda del día" de Admin y "Mis clases a dictar" de cada Instructor
    {
      scheduleName: "HIIT Cardio",
      instructorEmail: "gabrielmartinez@gmail.com",
      date: getRelativeDate(0),
      startTime: "09:00",
      status: "SCHEDULED" as const,
      bookings: [
        { memberEmail: "juan.perez@example.com", status: "CONFIRMED" as const },
        { memberEmail: "maria.gomez@example.com", status: "CONFIRMED" as const },
      ],
    },
    {
      scheduleName: "Spinning Interval",
      instructorEmail: "gabrielmartinez@gmail.com",
      date: getRelativeDate(0),
      startTime: "17:30",
      status: "SCHEDULED" as const,
      bookings: [
        { memberEmail: "maria.gomez@example.com", status: "CONFIRMED" as const },
        { memberEmail: "carlos.fernandez@example.com", status: "CONFIRMED" as const },
      ],
    },
    {
      scheduleName: "Crossfit WOD",
      instructorEmail: "martingonzales2004@gmail.com",
      date: getRelativeDate(0),
      startTime: "19:00",
      status: "SCHEDULED" as const,
      bookings: [
        { memberEmail: "carlos.fernandez@example.com", status: "CONFIRMED" as const },
      ],
    },
    {
      scheduleName: "Yoga Vinyasa",
      instructorEmail: "mramirez@hotmail.com",
      date: getRelativeDate(0),
      startTime: "20:15",
      status: "SCHEDULED" as const,
      bookings: [
        { memberEmail: "juan.perez@example.com", status: "CONFIRMED" as const },
      ],
    },

    // --- MAÑANA (dayOffset = 1) ---
    {
      scheduleName: "Pilates Mat",
      instructorEmail: "mramirez@hotmail.com",
      date: getRelativeDate(1),
      startTime: "10:00",
      status: "SCHEDULED" as const,
      bookings: [
        { memberEmail: "maria.gomez@example.com", status: "CONFIRMED" as const },
      ],
    },
    {
      scheduleName: "Crossfit WOD",
      instructorEmail: "martingonzales2004@gmail.com",
      date: getRelativeDate(1),
      startTime: "18:00",
      status: "SCHEDULED" as const,
      bookings: [
        { memberEmail: "carlos.fernandez@example.com", status: "CONFIRMED" as const },
        { memberEmail: "maria.gomez@example.com", status: "CONFIRMED" as const },
      ],
    },
    {
      scheduleName: "Yoga Vinyasa",
      instructorEmail: "mramirez@hotmail.com",
      date: getRelativeDate(1),
      startTime: "19:30",
      status: "SCHEDULED" as const,
      bookings: [
        { memberEmail: "juan.perez@example.com", status: "CONFIRMED" as const },
        { memberEmail: "carlos.fernandez@example.com", status: "CANCELLED" as const },
      ],
    },

    // --- DÍA +2 ---
    {
      scheduleName: "Stretching & Movilidad",
      instructorEmail: "mramirez@hotmail.com",
      date: getRelativeDate(2),
      startTime: "09:30",
      status: "SCHEDULED" as const,
      bookings: [
        { memberEmail: "juan.perez@example.com", status: "CONFIRMED" as const },
      ],
    },
    {
      scheduleName: "HIIT Cardio",
      instructorEmail: "gabrielmartinez@gmail.com",
      date: getRelativeDate(2),
      startTime: "19:00",
      status: "SCHEDULED" as const,
      bookings: [
        { memberEmail: "carlos.fernandez@example.com", status: "CONFIRMED" as const },
      ],
    },
    {
      // Clase cancelada con anticipación para probar el tag de "CANCELLED"
      scheduleName: "Crossfit WOD",
      instructorEmail: "martingonzales2004@gmail.com",
      date: getRelativeDate(2),
      startTime: "20:30",
      status: "CANCELLED" as const,
      bookings: [],
    },

    // --- DÍA +3 ---
    {
      scheduleName: "Spinning Interval",
      instructorEmail: "gabrielmartinez@gmail.com",
      date: getRelativeDate(3),
      startTime: "18:00",
      status: "SCHEDULED" as const,
      bookings: [
        { memberEmail: "maria.gomez@example.com", status: "CONFIRMED" as const },
      ],
    },
    {
      scheduleName: "Pilates Mat",
      instructorEmail: "mramirez@hotmail.com",
      date: getRelativeDate(3),
      startTime: "19:15",
      status: "SCHEDULED" as const,
      bookings: [],
    },

    // --- DÍA +5 ---
    {
      scheduleName: "Yoga Vinyasa",
      instructorEmail: "mramirez@hotmail.com",
      date: getRelativeDate(5),
      startTime: "10:30",
      status: "SCHEDULED" as const,
      bookings: [
        { memberEmail: "maria.gomez@example.com", status: "CONFIRMED" as const },
      ],
    },
  ];

  for (const sessionData of standaloneSessionsData) {
    const scheduleInfo = schedulesByName.get(sessionData.scheduleName);
    if (!scheduleInfo) {
      throw new Error(`Schedule no encontrado: ${sessionData.scheduleName}`);
    }

    const instructorId = instructorsByEmail.get(sessionData.instructorEmail);
    if (!instructorId) {
      throw new Error(`Instructor no encontrado: ${sessionData.instructorEmail}`);
    }

    const confirmedCount = sessionData.bookings.filter(
      (b) => b.status === "CONFIRMED",
    ).length;
    const remainingCapacity = Math.max(0, scheduleInfo.maxCapacity - confirmedCount);

    const createdSession = await prisma.classSession.create({
      data: {
        classScheduleId: scheduleInfo.id,
        instructorId,
        date: sessionData.date,
        startTime: sessionData.startTime,
        remainingCapacity,
        status: sessionData.status,
      },
    });

    for (const booking of sessionData.bookings) {
      const memberId = membersByEmail.get(booking.memberEmail);
      if (!memberId) {
        throw new Error(`Socio no encontrado: ${booking.memberEmail}`);
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

  // --------------------------------------------------------------------------
  // 7. BANCO COMPLETO DE EJERCICIOS
  // --------------------------------------------------------------------------
  console.log("🏋️ Creando catálogo de ejercicios (Pecho, Espalda, Piernas, Hombros, Brazos, Core)...");
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

  // --------------------------------------------------------------------------
  // 8. RUTINAS PREDISEÑADAS Y ASIGNACIÓN DE EJERCICIOS
  // --------------------------------------------------------------------------
  console.log("📋 Creando rutinas prediseñadas y ejercicios asignados...");

  for (const template of routineTemplates) {
    const instructorId = instructorsByEmail.get(template.instructorEmail);
    if (!instructorId) {
      throw new Error(`Instructor no encontrado para rutina: ${template.instructorEmail}`);
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
        throw new Error(`Ejercicio no encontrado: ${ex.exerciseName}`);
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

  console.log("\n========================================================");
  console.log("✅ Seed completado con éxito. Resumen de cuentas para demo:");
  console.log("--------------------------------------------------------");
  console.log("👑 ADMIN:");
  console.log("   - admin@gym.com / admin1234");
  console.log("🥋 INSTRUCTORES:");
  console.log("   - gabrielmartinez@gmail.com / instructor1234 (Spinning, HIIT, Full Body)");
  console.log("   - martingonzales2004@gmail.com / instructor1234 (Crossfit, Funcional, Torso)");
  console.log("   - mramirez@hotmail.com / instructor1234 (Yoga, Pilates, Piernas)");
  console.log("🏃 SOCIOS:");
  console.log("   - juan.perez@example.com / member1234 (Plan Básico, Activo)");
  console.log("   - maria.gomez@example.com / member1234 (Plan Plus, Reservas activas)");
  console.log("   - carlos.fernandez@example.com / member1234 (Plan Premium, Seguimiento)");
  console.log("   - diego.sosa@example.com / member1234 (Membresía VENCIDA -> Alerta en Dashboard)");
  console.log("   - lucia.martinez@example.com / member1234 (Socia Inactiva / Membresía Cancelada)");
  console.log("========================================================\n");
}

main()
  .catch((error) => {
    console.error("❌ Error ejecutando seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
