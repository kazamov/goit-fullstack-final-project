import { Router } from 'express';

import {
  CreateUserPayloadSchema,
  LoginUserPayloadSchema,
} from '@goit-fullstack-final-project/schemas';

import { catchErrors } from '../../decorators/catchErrors.js';
import { validateBody } from '../../decorators/validateBody.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { upload } from '../../middlewares/upload.js';

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

router.get('/current', authenticate, catchErrors(controller.getCurrentUser));

router.get(
  '/:userId/details',
  authenticate,
  catchErrors(controller.getUserDetails),
);

router.get(
  '/:userId/followers',
  authenticate,
  catchErrors(controller.getUserFollowers),
);

router.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  catchErrors(controller.updateAvatar),
);

export default router;
