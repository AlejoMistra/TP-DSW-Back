import { Router } from 'express';
import { socioRouter } from './socio.router';

const apiRouter = Router();

apiRouter.use('/socios', socioRouter);

export default apiRouter;