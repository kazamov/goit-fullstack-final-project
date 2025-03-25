import type { Response } from 'express';

import { getConfig } from '../config.js';
import {
  COOKIES_EXPIRATION_TIME,
  COOKIES_SESSION_KEY,
} from '../constants/cookies.js';

const config = getConfig();

export function setSessionCookie(res: Response, token: string): Response {
  res.cookie(COOKIES_SESSION_KEY, token, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'strict',
    maxAge: COOKIES_EXPIRATION_TIME,
  });
  return res;
}

export function clearSessionCookie(res: Response): Response {
  res.clearCookie(COOKIES_SESSION_KEY, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'strict',
  });
  return res;
}
