import type { Request, Response } from 'express';

import type {
  CreateUserPayload,
  LoginUserPayload,
  UserSchemaAttributes,
} from '@goit-fullstack-final-project/schemas';

import * as service from './service.js';

export async function createUser(req: Request, res: Response) {
  const { body } = req;

  const user = await service.createUser(body as CreateUserPayload);

  res.status(201).json(user);
}

export async function loginUser(req: Request, res: Response) {
  const { body } = req;

  const user = await service.loginUser(body as LoginUserPayload);

  res.status(200).json(user);
}

export async function logoutUser(req: Request, res: Response) {
  const { id } = req.user as UserSchemaAttributes;

  await service.logoutUser(id);

  res.status(204).send();
}
