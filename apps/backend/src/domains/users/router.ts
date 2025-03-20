import { Router } from 'express';

import {
  CreateUserPayloadSchema,
  LoginUserPayloadSchema,
} from '@goit-fullstack-final-project/schemas';

import { catchErrors } from '../../decorators/catchErrors.js';
import { validateBody } from '../../decorators/validateBody.js';
import { authenticate } from '../../middlewares/authenticate.js';

import * as controller from './controller.js';

const router: Router = Router();

router.post(
  '/register',
  validateBody(CreateUserPayloadSchema),
  catchErrors(controller.createUser),
);

router.post(
  '/login',
  validateBody(LoginUserPayloadSchema),
  catchErrors(controller.loginUser),
);

router.post('/logout', authenticate, catchErrors(controller.logoutUser));

router.get(
  '/details/:userId',
  authenticate,
  catchErrors(controller.getUserDetails),
);

export default router;
