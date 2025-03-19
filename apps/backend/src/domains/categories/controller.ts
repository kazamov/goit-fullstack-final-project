import type { Request, Response } from 'express';

import * as service from './service.js';

export async function getCategories(req: Request, res: Response) {
  const categories = await service.getCategories();
  res.status(200).json(categories);
}
