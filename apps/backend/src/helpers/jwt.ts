import jwt, { type SignOptions } from 'jsonwebtoken';

import type { JwtUserPayload } from '@goit-fullstack-final-project/schemas';

import { getConfig } from '../config.js';

const {
  jwt: { secret, expiresIn },
} = getConfig();

export function createToken(payload: JwtUserPayload): string {
  return jwt.sign(payload, secret, {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  });
}

type VerifyTokenResult =
  | { data: JwtUserPayload; error: null }
  | { data: null; error: Error };

export function verifyToken(token: string): VerifyTokenResult {
  try {
    const data = jwt.verify(token, secret as string) as JwtUserPayload;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}
