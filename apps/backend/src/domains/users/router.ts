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
  '/:userId/recipes',
  authenticate,
  catchErrors(controller.getUserRecipes),
);

router.get(
  '/favorites',
  authenticate,
  catchErrors(controller.getUserFavorites),
);

router.get(
  '/:userId/followers',
  authenticate,
  catchErrors(controller.getUserFollowers),
);

router.get(
  '/:userId/followings',
  authenticate,
  catchErrors(controller.getUserFollowings),
);

router.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  catchErrors(controller.updateAvatar),
);

router.post(
  '/:userId/follow',
  authenticate,
  catchErrors(controller.followUser),
);

router.delete(
  '/:userId/follow',
  authenticate,
  catchErrors(controller.unfollowUser),
);

export default router;
