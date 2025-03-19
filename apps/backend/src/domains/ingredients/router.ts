import { Router } from 'express';

import { catchErrors } from '../../decorators/catchErrors.js';

import * as controller from './controller.js';

const router: Router = Router();

router.get('/', catchErrors(controller.getIngredients));

export default router;
