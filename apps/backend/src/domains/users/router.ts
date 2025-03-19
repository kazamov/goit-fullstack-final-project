import { Router } from 'express';

import { CreateUserPayloadSchema } from '@goit-fullstack-final-project/schemas';

import { catchErrors } from '../../decorators/catchErrors.js';
import { validateBody } from '../../decorators/validateBody.js';

import * as controller from './controller.js';

const router: Router = Router();

router.get('/', (_req, res) => {
  res.status(200).send('Get user');
});

router.post(
  '/register',
  validateBody(CreateUserPayloadSchema),
  catchErrors(controller.createUser),
);

export default router;
