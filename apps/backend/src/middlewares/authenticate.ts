import type { NextFunction, Request, Response } from 'express';

import { COOKIES_SESSION_KEY } from '../constants/cookies.js';
import { findUser } from '../domains/users/service.js';
import HttpError from '../helpers/HttpError.js';
import { verifyToken } from '../helpers/jwt.js';
import { clearSessionCookie } from '../helpers/sessionCookie.js';

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies[COOKIES_SESSION_KEY];

  if (!token) {
    return next(new HttpError('Authentication token is missing', 401));
  }

  const { data, error } = verifyToken(token);

  if (error) {
    clearSessionCookie(res);
    return next(new HttpError(error.message, 401));
  }

  const user = await findUser({ email: data.email, id: data.id });

  if (!user) {
    clearSessionCookie(res);
    return next(new HttpError('User not found', 401));
  }

  if (user.token !== token) {
    clearSessionCookie(res);
    return next(new HttpError('Invalid token', 401));
  }

  req.user = user;

  next();
}
