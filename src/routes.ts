import { Router } from 'express';
import { socioRouter } from './socio/socio.router';

const apiRouter = Router();

apiRouter.use('/socios', socioRouter);
//apiRouter.use('/instructores', instructorRouter);

export default apiRouter;