import fs from 'fs/promises';

import type { Request, Response } from 'express';

import {
  type CreateUserPayload,
  GetCurrentUserResponseSchema,
  type LoginUserPayload,
  type UserSchemaAttributes,
} from '@goit-fullstack-final-project/schemas';

import HttpError from '../../helpers/HttpError.js';
import {
  clearSessionCookie,
  setSessionCookie,
} from '../../helpers/sessionCookie.js';

import type { PagingQuery } from './service.js';
import * as service from './service.js';

export async function createUser(req: Request, res: Response) {
  const { body } = req;

  const [user, token] = await service.createUser(body as CreateUserPayload);

  setSessionCookie(res, token).status(201).json(user);
}

export async function loginUser(req: Request, res: Response) {
  const { body } = req;

  const [user, token] = await service.loginUser(body as LoginUserPayload);

  setSessionCookie(res, token).status(200).json(user);
}

export async function logoutUser(req: Request, res: Response) {
  const { id } = req.user as UserSchemaAttributes;

  await service.logoutUser(id);

  clearSessionCookie(res)
    .status(200)
    .send({ message: 'User was logged successfully' });
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

export async function getUserRecipes(req: Request, res: Response) {
  const { userId } = req.params;
  const query = req.query as PagingQuery;

  const recipes = await service.getUserRecipes(userId, query);

  res.status(200).json(recipes);
}

export async function getUserFavorites(req: Request, res: Response) {
  const { id: userId } = req.user as UserSchemaAttributes;
  const query = req.query as PagingQuery;

  const favorites = await service.getUserFavorites(userId, query);

  res.status(200).json(favorites);
}

export async function getUserFollowers(req: Request, res: Response) {
  const { userId } = req.params;
  const { id: currentUserId } = req.user as UserSchemaAttributes;
  const query = req.query as PagingQuery;

  const followers = await service.getUserFollowers(
    userId,
    currentUserId,
    query,
  );

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
  const { id: currentUserId } = req.user as UserSchemaAttributes;
  const query = req.query as PagingQuery;

  const followings = await service.getUserFollowings(
    userId,
    currentUserId,
    query,
  );

  if (!followings) {
    throw new HttpError(`User with id '${userId}' not found`, 404);
  }

  res.status(200).json(followings);
}

export async function followUser(req: Request, res: Response) {
  const { id: currentUserId } = req.user as UserSchemaAttributes;
  const { userId } = req.params;

  await service.followUser(currentUserId, userId);

  res.status(200).json({ message: 'User followed' });
}

export async function unfollowUser(req: Request, res: Response) {
  const { id: currentUserId } = req.user as UserSchemaAttributes;
  const { userId } = req.params;

  await service.unfollowUser(currentUserId, userId);

  res.status(200).json({ message: 'User unfollowed' });
}
