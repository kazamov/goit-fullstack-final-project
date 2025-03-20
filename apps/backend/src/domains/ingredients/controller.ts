import type { Request, Response } from 'express';

import * as service from './service.js';

export async function getIngredients(req: Request, res: Response) {
  const ingredients = await service.getIngredients();
  res.status(200).json(ingredients);
}
