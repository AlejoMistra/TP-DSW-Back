import { Router, Request, Response } from 'express';
import { SocioRepository } from '../socio/socio.repository';
import { SocioService } from './socio.service';

export const socioRouter = Router();

// Instanciación (En proyectos grandes esto se maneja con Inyección de Dependencias, ej: TSyringe)
const repository = new SocioRepository();
const service = new SocioService(repository);

//GET /api/socios
socioRouter.get('/', async (req: Request, res: Response) => {
  try {
    const socios = await service.getAll();
    res.status(200).json(socios);
  } catch (error) {
    //Validaciones para atrapar errores evitando que rompa el server y para devolver mensajes claros.
    res.status(500).json({ message: 'Error al obtener los socios' });
  }
});

//GET /api/socios/:id

socioRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'El parámetro ID debe ser un número válido.' });
    }

    const socio = await service.getById(id);
    return res.status(200).json(socio);
  }
  catch (error) {
    if(error instanceof Error && error.message === 'Socio no encontrado'){
      return res.status(404).json({error: error.message});
    }
    return res.status(500).json({error: 'Error interno al buscar el socio'})
    }
});

