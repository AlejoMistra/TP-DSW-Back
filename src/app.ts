import express from 'express';
import apiRouter from './routes';

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Bienvenido a la API de gestión de socios de gimnasio.',
    endpoints: {
      '/api/socios': 'GET: Obtener todos los socios',
      '/api/socios/:id': 'GET: Obtener un socio por ID',
    }
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api', apiRouter);

export { app };
