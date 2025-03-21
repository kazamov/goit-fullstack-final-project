import fs from 'fs/promises';

import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

import HttpError, { type FieldError } from '../helpers/HttpError.js';

export function validateBody<T>(schema: ZodSchema<T>) {
  const func = async (req: Request, _res: Response, next: NextFunction) => {
    const { error, data } = schema.safeParse(req.body);
    if (error) {
      const errorMessages: FieldError[] = error.issues.map((issue) => {
        if (issue.path.length === 0) {
          return { field: '', message: issue.message };
        }
        return { field: issue.path.join('.'), message: issue.message };
      });

      if (req.file) {
        // Remove the uploaded file if validation fails
        try {
          await fs.unlink(req.file.path);
        } catch {
          // Ignore errors while deleting the file
        }
      }

      next(new HttpError('Validation failed', 400, errorMessages));
    } else if (data) {
      req.body = data;
    }
    next();
  };

  return func;
}
