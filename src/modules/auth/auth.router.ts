import { Router } from 'express';
import { authController } from '../../shared/instances.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/authentication.middleware.js';
import { ActivateAccountSchema, LoginSchema } from './auth.schemas.js';

export const authRouter = Router();

authRouter.post('/login', validate(LoginSchema), authController.login);
authRouter.post(
  '/activate-account',
  authenticate,
  validate(ActivateAccountSchema),
  authController.activateAccount,
);
