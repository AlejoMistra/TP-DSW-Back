import express from 'express';
import { socioRouter } from './socio/socio.router.js';
import { instructorRouter } from './instructor/instructor.router.js';
import cors from 'cors';

const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    message: 'Bienvenido a la API de gestión de socios de gimnasio.',
    endpoints: {
      '/health': 'GET: Verificar el estado del servidor',
      '/api/socios': 'GET: Obtener todos los socios | POST: Crear nuevo socio',
      '/api/socios/:id':
        'GET: Obtener un socio | PUT: Actualizar socio | DELETE: Eliminar socio',
      '/api/instructors':
        'GET: Obtener todos los instructores | POST: Crear nuevo instructor',
      '/api/instructors/:id':
        'GET: Obtener un instructor | PUT: Actualizar instructor | DELETE: Eliminar instructor',
    },
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/socios', socioRouter);
app.use('/api/instructors', instructorRouter);
export { app };
