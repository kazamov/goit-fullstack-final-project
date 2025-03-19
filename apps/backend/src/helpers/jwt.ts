import jwt from 'jsonwebtoken';

import type { JwtUserPayload } from '@goit-fullstack-final-project/schemas';

const { JWT_SECRET } = process.env;

export const createToken = (payload: JwtUserPayload): string =>
  jwt.sign(payload, JWT_SECRET as string, { expiresIn: '24h' });

type VerifyTokenResult =
  | { data: JwtUserPayload; error: null }
  | { data: null; error: Error };

export const verifyToken = (token: string): VerifyTokenResult => {
  try {
    const data = jwt.verify(token, JWT_SECRET as string) as JwtUserPayload;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};
