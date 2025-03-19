import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

import HttpError, { type FieldError } from '../helpers/HttpError.js';

export function validateBody<T>(schema: ZodSchema<T>) {
  const func = (req: Request, _res: Response, next: NextFunction) => {
    const { error } = schema.safeParse(req.body);
    if (error) {
      const errorMessages: FieldError[] = error.issues.map((issue) => {
        if (issue.path.length === 0) {
          return { field: '', message: issue.message };
        }
        return { field: issue.path.join('.'), message: issue.message };
      });
      next(new HttpError('Validation failed', 400, errorMessages));
    }
    next();
  };

  return func;
}
