import { Router } from 'express';

import { catchErrors } from '../../decorators/catchErrors.js';

import * as controller from './controller.js';

const router: Router = Router();

router.get('/', catchErrors(controller.getTestimonials));

export default router;
