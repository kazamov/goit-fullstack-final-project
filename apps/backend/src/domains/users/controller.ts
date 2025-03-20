import type { Request, Response } from 'express';

import type {
  CreateUserPayload,
  LoginUserPayload,
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

export async function getUserDetails(req: Request, res: Response) {
  const currentUserId = req.user?.id as string;
  const { userId } = req.params;

  const user = await service.getUserDetails(userId, currentUserId);

  res.status(200).json(user);
}
