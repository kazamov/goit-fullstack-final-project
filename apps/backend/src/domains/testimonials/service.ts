import type { GetTestimonialResponse } from '@goit-fullstack-final-project/schemas';
import { GetTestimonialResponseSchema } from '@goit-fullstack-final-project/schemas';

import { TestimonialDTO } from '../../infrastructure/db/index.js';

export async function getTestimonials(): Promise<GetTestimonialResponse> {
  const testimonials = await TestimonialDTO.findAll();
  return GetTestimonialResponseSchema.parse(
    testimonials.map((testimonial) => testimonial.toJSON()),
  );
}
