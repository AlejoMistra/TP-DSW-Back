import { Router, Request, Response } from 'express';
import { membershipPlanRepository } from '../../shared/instances.js';
import { MembershipPlanService } from './membershipPlan.service.js';
import { CreatePlanSchema, UpdatePlanSchema, PlanIdSchema } from './membershipPlan.schemas.js';
import { getErrorMessage } from '../../utils/errorHandler.js';
import { z } from 'zod';

export const membershipPlanRouter = Router();
const service = new MembershipPlanService(membershipPlanRepository);

// GET /api/membership-plans
membershipPlanRouter.get('/', async (req: Request, res: Response) => {
  // FIXME: Cuando el plan no existe, service.getPlanById lanza un Error(\"Plan no encontrado\") y este handler lo convierte en 500. Eso hace que un caso esperado (no encontrado) se reporte como error interno. Solución: detectar explícitamente el caso 'not found' (por error tipado o por retorno null) y responder con 404.

  try {
    const plans = await service.getAllPlans();
    res.status(200).json(plans);
  } catch (error) {
    // TODO: cambiar al handler error cuando esté implementado
    //handleError(error, res);
    
    res
      .status(500)
      .json({ message: 'Error al obtener los planes de membresía' });
  }
});

// GET /api/membership-plans/:id
membershipPlanRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = PlanIdSchema.parse({ id: req.params.id });
    const plan = await service.getPlanById(validatedId.id);
    return res.status(200).json(plan);
  } catch (error) {
    // TODO: cambiar al handler error cuando esté implementado
    //handleError(error, res);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validación fallida',
        details: error.issues,
      });
    }
    res.status(404).json({ error: getErrorMessage(error) });
  }
});

// POST /api/membership-plans - Crear nuevo plan de membresía
membershipPlanRouter.post('/', async (req: Request, res: Response) => {
  // TODO: Se agregan nuevos endpoints y ramas de validación/errores (400 por Zod, 404 por no encontrado, 201/200/500) pero falta cobertura de tests para: validación de :id, create/update con body inválido, get/update/delete de id inexistente (especialmente el bug de 404 vs 500), y flujo feliz.

  try {
    const validatedData = CreatePlanSchema.parse(req.body);
    const newPlan = await service.createPlan(validatedData);
    res.status(201).json(newPlan);
  } catch (error) {
    // TODO: cambiar al handler error cuando esté implementado
    //handleError(error, res);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validación fallida',
        details: error.issues,
      });
    }
    res.status(500).json({ message: 'Error al crear el plan de membresía' });
  }
});

// PUT /api/membership-plans/:id - Actualizar plan de membresía existente
membershipPlanRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = PlanIdSchema.parse({ id: req.params.id });
    const validatedData = UpdatePlanSchema.parse(req.body);
    const updatedPlan = await service.updatePlan(validatedId.id, validatedData);
    res.status(200).json(updatedPlan);
  } catch (error) {
    // TODO: cambiar al handler error cuando esté implementado
    //handleError(error, res);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validación fallida',
        details: error.issues,
      });
    }
    res.status(404).json({ error: getErrorMessage(error) });
  }
});

// DELETE /api/membership-plans/:id - Eliminar plan de membresía existente
membershipPlanRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const validatedId = PlanIdSchema.parse({ id: req.params.id });
    await service.deletePlan(validatedId.id);
    res.status(204).send();
  } catch (error) {
    // TODO: cambiar al handler error cuando esté implementado
    //handleError(error, res);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validación fallida',
        details: error.issues,
      });
    }
    res.status(500).json({ message: 'Error al eliminar el plan de membresía' });
  }
});
