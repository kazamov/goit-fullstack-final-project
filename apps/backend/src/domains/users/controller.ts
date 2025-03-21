import fs from 'fs/promises';

import type { Request, Response } from 'express';

import {
  type CreateUserPayload,
  GetCurrentUserResponseSchema,
  type LoginUserPayload,
  type UserSchemaAttributes,
} from '@goit-fullstack-final-project/schemas';

import HttpError from '../../helpers/HttpError.js';

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

export async function getCurrentUser(req: Request, res: Response) {
  res.status(200).json(GetCurrentUserResponseSchema.parse(req.user));
}

export async function getUserDetails(req: Request, res: Response) {
  const currentUserId = req.user?.id as string;
  const { userId } = req.params;

  const user = await service.getUserDetails(userId, currentUserId);

  res.status(200).json(user);
}

export async function getUserFollowers(req: Request, res: Response) {
  const { userId } = req.params;

  const followers = await service.getUserFollowers(userId);

  if (!followers) {
    throw new HttpError(`User with id '${userId}' not found`, 404);
  }

  res.status(200).json(followers);
}

export async function updateAvatar(req: Request, res: Response) {
  const { id: userId } = req.user as UserSchemaAttributes;
  const { file } = req;

  if (!file) {
    throw new HttpError('File is required', 400);
  }

  try {
    const avatarUrl = await service.updateAvatar(
      userId,
      file as Express.Multer.File,
    );
    res.status(200).json({ avatarURL: avatarUrl });
  } catch (error) {
    throw new HttpError((error as Error).message, 400);
  } finally {
    await fs.unlink(file?.path as string);
  }
}

export async function getUserFollowings(req: Request, res: Response) {
  const { userId } = req.params;

  const followings = await service.getUserFollowings(userId);

  if (!followings) {
    throw new HttpError(`User with id '${userId}' not found`, 404);
  }

  res.status(200).json(followings);
}
