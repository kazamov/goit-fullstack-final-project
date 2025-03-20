import type { Request, Response } from 'express';

import * as service from './service.js';

export async function getAreas(_req: Request, res: Response) {
  const areas = await service.getAreas();
  res.status(200).json(areas);
}
