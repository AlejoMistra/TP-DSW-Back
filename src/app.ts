import express from 'express';
import cors from 'cors';
import { memberRouter } from './modules/member/member.router.js';
import { instructorRouter } from './modules/instructor/instructor.router.js';
import { membershipRouter } from './modules/membership/membership.router.js';
import { membershipPlanRouter } from './modules/membershipPlan/membershipPlan.routes.js';
import { classScheduleRouter } from './modules/classSchedule/classSchedule.router.js';
import { exerciseRouter } from './modules/exercise/exercise.router.js';
import { classBookingRouter } from './modules/classBooking/classBooking.router.js';
import { classSessionRouter } from './modules/classSession/classSession.router.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

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
  '/api/members':
    'GET: Obtener todos los socios | POST: Crear nuevo socio',
  '/api/members/:id':
    'GET: Obtener un socio | PUT: Actualizar socio | DELETE: Eliminar socio',
  '/api/instructors':
    'GET: Obtener todos los instructores | POST: Crear nuevo instructor',
  '/api/instructors/:id':
    'GET: Obtener un instructor | PUT: Actualizar instructor | DELETE: Eliminar instructor',
  '/api/exercises':
    'GET: Obtener todos los ejercicios | POST: Crear nuevo ejercicio',
  '/api/exercises/:id':
    'GET: Obtener un ejercicio | PUT: Actualizar ejercicio | DELETE: Eliminar ejercicio',
  '/api/classSchedules':
    'GET: Obtener todos los horarios de clase | POST: Crear nuevo horario de clase',
  '/api/classSchedules/:id':
    'GET: Obtener un horario de clase | PUT: Actualizar horario de clase | DELETE: Eliminar horario de clase',
  '/api/classSchedules/instructor/:instructorId':
    'GET: Obtener todos los horarios de clase de un instructor',
  '/api/classSchedules/category/:category':
    'GET: Obtener todos los horarios de clase de una categoría',
  '/api/classSchedules/day/:dayOfWeek':
    'GET: Obtener todos los horarios de clase de un día',
  '/api/membership-plans':
    'GET: Obtener todos los planes de membresía | POST: Crear nuevo plan de membresía',
  '/api/membership-plans/:id':
    'GET: Obtener un plan de membresía | PUT: Actualizar plan de membresía | DELETE: Eliminar plan de membresía',
  '/api/classBookings':
    'GET: Obtener todas las reservas de clase | POST: Crear nueva reserva de clase',
  '/api/classBookings/:id':
    'GET: Obtener una reserva de clase | PUT: Actualizar reserva de clase | DELETE: Eliminar reserva de clase',
  '/api/classSessions':
    'GET: Obtener todas las sesiones de clase | POST: Crear nueva sesión de clase',
  '/api/classSessions/:id':
    'GET: Obtener una sesión de clase | PUT: Actualizar sesión de clase | DELETE: Eliminar sesión de clase',
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

app.use('/api/members', memberRouter);
app.use('/api/instructors', instructorRouter);
app.use('/api/memberships', membershipRouter);
app.use('/api/membership-plans', membershipPlanRouter);
app.use('/api/classSchedules', classScheduleRouter);
app.use('/api/exercises', exerciseRouter);
app.use('/api/classBookings', classBookingRouter);
app.use('/api/classSessions', classSessionRouter);

app.use(errorHandler);

export { app };
