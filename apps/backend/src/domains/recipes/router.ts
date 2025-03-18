import { Router } from 'express';

import { catchErrors } from '../../decorators/catchErrors';
import { validateBody } from '../../decorators/validateBody';
import {
  CreateRecipePayloadSchema,
  UpdateRecipePayloadSchema,
} from '../../schemas/Recipe';

import * as controller from './controller';

const router: Router = Router();

router.get('/', catchErrors(controller.getRecipes));

router.get('/:id', catchErrors(controller.getRecipe));

router.post(
  '/',
  validateBody(CreateRecipePayloadSchema),
  catchErrors(controller.createRecipe),
);

router.put(
  '/:id',
  validateBody(UpdateRecipePayloadSchema),
  catchErrors(controller.updateRecipe),
);

router.delete('/:id', catchErrors(controller.deleteRecipe));

export default router;
