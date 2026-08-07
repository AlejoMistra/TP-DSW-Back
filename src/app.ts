import express from 'express';
import { memberRouter } from './modules/member/member.router.js';
import { instructorRouter } from './modules/instructor/instructor.router.js';
import { membershipRouter } from './modules/membership/membership.router.js';
import { membershipPlanRouter } from './modules/membershipPlan/membershipPlan.router.js';
import { classScheduleRouter } from './modules/classSchedule/classSchedule.router.js';
import { exerciseRouter } from './modules/exercise/exercise.router.js';
import cors from 'cors';

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

export { app };
