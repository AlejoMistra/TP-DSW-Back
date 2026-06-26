import { Router, Request, Response } from 'express';
import { SocioRepository } from '../socio/socio.repository.js';
import { SocioService } from './socio.service.js';
import {
  SocioIdSchema,
  CreateSocioSchema,
  UpdateSocioSchema,
} from './socio.schemas.js';
import { z } from 'zod';

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
    // Validar el parámetro ID con Zod
    const validatedId = SocioIdSchema.parse({ id: req.params.id });

    const socio = await service.getById(validatedId.id);

    return res.status(200).json(socio);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validación fallida',
        details: error.issues,
      });
    }
    res.status(500).json({ message: 'Error al obtener el socio' });
  }
});

//POST /api/socios - Crear nuevo socio
socioRouter.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = CreateSocioSchema.parse(req.body);
    const nuevoSocio = await service.create(validatedData);
    res.status(201).json(nuevoSocio);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validación fallida',
        details: error.issues,
      });
    }
    res.status(500).json({ message: 'Error al crear el socio' });
  }
});

//PUT /api/socios/:id - Actualizar socio
socioRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = SocioIdSchema.parse({ id: req.params.id });
    const validatedData = UpdateSocioSchema.parse(req.body);

    const socioActualizado = await service.update(
      validatedId.id,
      validatedData,
    );

    if (!socioActualizado) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }

    res.status(200).json(socioActualizado);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validación fallida',
        details: error.issues,
      });
    }
    res.status(500).json({ message: 'Error al actualizar el socio' });
  }
});

//DELETE /api/socios/:id - Eliminar socio
socioRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = SocioIdSchema.parse({ id: req.params.id });

    const eliminado = await service.delete(validatedId.id);

    if (!eliminado) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validación fallida',
        details: error.issues,
      });
    }
    res.status(500).json({ message: 'Error al eliminar el socio' });
  }
});
