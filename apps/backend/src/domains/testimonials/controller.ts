import type { Request, Response } from 'express';

import * as service from './service.js';

export async function getTestimonials(_req: Request, res: Response) {
  const testimonials = await service.getTestimonials();
  res.status(200).json(testimonials);
}
