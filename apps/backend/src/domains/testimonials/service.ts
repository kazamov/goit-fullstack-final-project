import type { GetTestimonialResponse } from '@goit-fullstack-final-project/schemas';
import { GetTestimonialResponseSchema } from '@goit-fullstack-final-project/schemas';

import { TestimonialDTO, UserDTO } from '../../infrastructure/db/index.js';

export async function getTestimonials(): Promise<GetTestimonialResponse> {
  const testimonials = await TestimonialDTO.findAll({
    order: [['rating', 'DESC']],
    include: [
      {
        model: UserDTO,
        as: 'user',
        attributes: ['id', 'name'],
        required: false,
      },
    ],
  });

  const transformed = testimonials.map((testimonial) => {
    const data = testimonial.toJSON();
    return {
      id: data.id,
      text: data.text,
      rating: data.rating,
      user: {
        userId: data.userId,
        name: data.user?.name || '',
      },
    };
  });

  return GetTestimonialResponseSchema.parse(transformed);
}
