import express from 'express';
import apiRouter from './router';

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

export { app };
