import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import type { ActivateAccountInput, LoginInput } from './auth.schemas.js';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (req: Request, res: Response) => {
    const { body } = req.validated!;
    const result = await this.authService.login(body as LoginInput);
    res.status(200).json(result);
  };

  activateAccount = async (req: Request, res: Response) => {
    const { body } = req.validated!;
    const result = await this.authService.activateAccount(
      body as ActivateAccountInput,
    );
    res.status(200).json(result);
  };
}

