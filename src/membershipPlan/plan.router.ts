import { Router, Request, Response } from 'express';
import { planRepository } from '../shared/instances.js';
import { PlanService } from './plan.service.js';
import {
  CreatePlanSchema,
  UpdatePlanSchema,
  PlanIdSchema,
} from './plan.schemas.js';
import { handleError } from '../utils/errorHandler.js';

export const planRouter = Router();

const service = new PlanService(planRepository);

// GET /api/membership-plans
planRouter.get('/', async (req: Request, res: Response) => {
  // FIXME: Cuando el plan no existe, service.getPlanById lanza un Error(\"Plan no encontrado\") y este handler lo convierte en 500. Eso hace que un caso esperado (no encontrado) se reporte como error interno. Solución: detectar explícitamente el caso 'not found' (por error tipado o por retorno null) y responder con 404.

  try {
    const plans = await service.getAllPlans();
    res.status(200).json(plans);
  } catch (error) {
    handleError(error, res);
  }
});

// GET /api/membership-plans/:id
planRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = PlanIdSchema.parse({ id: req.params.id });
    const plan = await service.getPlanById(validatedId.id);
    return res.status(200).json(plan);
  } catch (error) {
    handleError(error, res);
  }
});

// POST /api/membership-plans - Crear nuevo plan de membresía
planRouter.post('/', async (req: Request, res: Response) => {
  // FIXME: Se agregan nuevos endpoints y ramas de validación/errores (400 por Zod, 404 por no encontrado, 201/200/500) pero falta cobertura de tests para: validación de :id, create/update con body inválido, get/update/delete de id inexistente (especialmente el bug de 404 vs 500), y flujo feliz.

  try {
    const validatedData = CreatePlanSchema.parse(req.body);
    const newPlan = await service.createPlan(validatedData);
    res.status(201).json(newPlan);
  } catch (error) {
    handleError(error, res);
  }
});

// PUT /api/membership-plans/:id - Actualizar plan de membresía existente
planRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = PlanIdSchema.parse({ id: req.params.id });
    const validatedData = UpdatePlanSchema.parse(req.body);
    const updatedPlan = await service.updatePlan(validatedId.id, validatedData);
    res.status(200).json(updatedPlan);
  } catch (error) {
    handleError(error, res);
  }
});

// DELETE /api/membership-plans/:id - Eliminar plan de membresía existente
planRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = PlanIdSchema.parse({ id: req.params.id });
    const deleted = await service.deletePlan(validatedId.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ message: 'Plan de membresía no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
});
