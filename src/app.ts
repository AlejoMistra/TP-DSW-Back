import express from 'express';
import cors from 'cors';
import { memberRouter } from './modules/member/member.routes.js';
import { instructorRouter } from './modules/instructor/instructor.routes.js';
import { membershipRouter } from './modules/membership/membership.routes.js';
import { membershipPlanRouter } from './modules/membershipPlan/membershipPlan.routes.js';
import { paymentRouter } from './modules/payment/payment.routes.js';
import { classScheduleRouter } from './modules/classSchedule/classSchedule.routes.js';
import { exerciseRouter } from './modules/exercise/exercise.routes.js';
import { classBookingRouter } from './modules/classBooking/classBooking.routes.js';
import { classSessionRouter } from './modules/classSession/classSession.routes.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import { routineRouter } from './modules/routine/routine.routes.js';
import { routineExerciseRouter } from './modules/routineExercise/routineExercise.routes.js';
import { authRouter } from './modules/auth/auth.router.js';
import { userRouter } from './modules/user/user.routes.js';

const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const availableEndpoints = {
  '/': 'GET: Resumen de la API',
  '/health': 'GET: Verificar el estado del servidor',
  '/api/auth/login': 'POST: Iniciar sesión',
  '/api/auth/activate-account': 'POST: Activar cuenta con verificación de identidad',
  '/api/users': 'GET: Obtener usuarios | POST: Crear usuario',
  '/api/users/:id': 'GET: Obtener usuario | PATCH: Actualizar usuario | DELETE: Eliminar usuario',
  '/api/members': 'GET: Obtener todos los socios | POST: Crear nuevo socio',
  '/api/members/with-membership': 'GET: Obtener socios con membresía',
  '/api/members/:id': 'GET: Obtener un socio | PATCH: Actualizar socio | DELETE: Eliminar socio',
  '/api/memberships': 'GET: Obtener todas las membresías | POST: Crear nueva membresía',
  '/api/memberships/member/:memberId': 'GET: Obtener membresía por socio',
  '/api/memberships/:id': 'GET: Obtener una membresía | PATCH: Actualizar membresía | DELETE: Eliminar membresía',
  '/api/memberships/:membershipId/payments': 'GET: Obtener pagos de una membresía | POST: Registrar pago en una membresía',
  '/api/membership-plans': 'GET: Obtener planes de membresía | POST: Crear plan de membresía',
  '/api/membership-plans/:id': 'GET: Obtener plan | PATCH: Actualizar plan | DELETE: Eliminar plan',
  '/api/payments': 'GET: Obtener todos los pagos | POST: Registrar pago',
  '/api/payments/:id': 'GET: Obtener un pago | PATCH: Actualizar pago | DELETE: Eliminar pago',
  '/api/instructors': 'GET: Obtener todos los instructores | POST: Crear instructor',
  '/api/instructors/:id': 'GET: Obtener instructor | PATCH/PUT: Actualizar instructor | DELETE: Eliminar instructor',
  '/api/exercises': 'GET: Obtener todos los ejercicios | POST: Crear ejercicio',
  '/api/exercises/:id': 'GET: Obtener ejercicio | PATCH: Actualizar ejercicio | DELETE: Eliminar ejercicio',
  '/api/classSchedules': 'GET: Obtener horarios de clase | POST: Crear horario de clase',
  '/api/classSchedules/:id': 'GET: Obtener horario | PUT: Actualizar horario | DELETE: Eliminar horario',
  '/api/classSchedules/category/:category': 'GET: Obtener horarios por categoría',
  '/api/classBookings': 'GET: Obtener reservas | POST: Crear reserva',
  '/api/classBookings/:id': 'GET: Obtener reserva | PATCH/PUT: Actualizar reserva | DELETE: Eliminar reserva',
  '/api/classSessions': 'GET: Obtener sesiones de clase | POST: Crear sesión',
  '/api/classSessions/:id': 'GET: Obtener sesión | PUT: Actualizar sesión | DELETE: Eliminar sesión',
  '/api/classSessions/instructor/:instructorId': 'GET: Obtener sesiones por instructor',
  '/api/classSessions/schedule/:classScheduleId': 'GET: Obtener sesiones por horario',
  '/api/routines': 'GET: Obtener rutinas | POST: Crear rutina',
  '/api/routines/:id': 'GET: Obtener rutina | PATCH: Actualizar rutina | DELETE: Eliminar rutina',
  '/api/routineExercise': 'GET: Obtener ejercicios de rutinas | POST: Crear ejercicio de rutina',
  '/api/routineExercise/:id': 'GET: Obtener ejercicio de rutina | PATCH: Actualizar ejercicio | DELETE: Eliminar ejercicio',
  '/api/routineExercise/routine/:routineId': 'GET: Obtener ejercicios por rutina',
} as const;

app.use(cors(corsOptions));

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    message: 'Bienvenido a la API de gestión de gimnasio.',
    endpoints: availableEndpoints,
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/members', memberRouter);
app.use('/api/instructors', instructorRouter);
app.use('/api/memberships', membershipRouter);
app.use('/api/membership-plans', membershipPlanRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/classSchedules', classScheduleRouter);
app.use('/api/exercises', exerciseRouter);
app.use('/api/classBookings', classBookingRouter);
app.use('/api/classSessions', classSessionRouter);
app.use('/api/routines', routineRouter);
app.use('/api/routineExercise', routineExerciseRouter);

app.use(errorHandler);

export { app };
