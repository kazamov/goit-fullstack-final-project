import { Router } from 'express';

import {
  CreateRecipePayloadSchema,
  UpdateRecipePayloadSchema,
} from '@goit-fullstack-final-project/schemas';

import { catchErrors } from '../../decorators/catchErrors.js';
import { validateBody } from '../../decorators/validateBody.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { upload } from '../../middlewares/upload.js';

import * as controller from './controller.js';

const router: Router = Router();

router.get('/', catchErrors(controller.getRecipes));

router.get('/popular', catchErrors(controller.getPopularRecipes));

router.get('/:id', catchErrors(controller.getRecipe));

router.post(
  '/',
  authenticate,
  upload.single('thumb'),
  // @ts-expect-error - TS does not understand that ingredients string should be transformed
  validateBody(CreateRecipePayloadSchema),
  catchErrors(controller.createRecipe),
);

router.put(
  '/:id',
  authenticate,
  validateBody(UpdateRecipePayloadSchema),
  catchErrors(controller.updateRecipe),
);

router.post(
  '/:id/favorite',
  authenticate,
  catchErrors(controller.addRecipeToFavorites),
);

router.delete(
  '/:id/favorite',
  authenticate,
  catchErrors(controller.removeRecipeFromFavorites),
);

router.delete('/:id', authenticate, catchErrors(controller.deleteRecipe));

export default router;
