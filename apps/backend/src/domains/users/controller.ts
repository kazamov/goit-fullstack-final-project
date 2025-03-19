import type { Request, Response } from 'express';

import type { CreateUserPayload } from '@goit-fullstack-final-project/schemas';

import * as service from './service.js';

export async function createUser(req: Request, res: Response) {
  const { body } = req;

  const user = await service.createUser(body as CreateUserPayload);

  res.status(201).json(user);
}
