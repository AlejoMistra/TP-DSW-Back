import express from 'express';
import { socioRouter } from './socio/socio.router.js';
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
    },
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/socios', socioRouter);

export { app };
