import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';

declare global {
  namespace Express {
    interface Request {
      validated?: { body?: unknown; params?: unknown; query?: unknown };
    }
  }
}

export const validate = (schema: ZodType<any>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return next(result.error); // ZodError -> error middleware central
    }

    req.validated = result.data;
    next();
  };
