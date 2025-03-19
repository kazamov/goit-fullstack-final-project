import type { UserSchemaAttributes } from '@goit-fullstack-final-project/schemas';

declare global {
  namespace Express {
    interface Request {
      user?: UserSchemaAttributes;
    }
  }
}

export {};
