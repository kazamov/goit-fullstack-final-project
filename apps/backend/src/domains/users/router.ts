import { Router } from 'express';

const router: Router = Router();

router.get('/', (_req, res) => {
  res.status(200).send('Get user');
});

router.post('/', (_req, res) => {
  res.status(201).send('Create user');
});

export default router;
