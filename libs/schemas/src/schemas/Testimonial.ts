import { z } from 'zod';

export const TestimonialSchema = z.object({
  id: z.string(),
  text: z.string(),
  rating: z.number().int().min(1).max(5),
  userId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Testimonial = z.infer<typeof TestimonialSchema>;

export const GetTestimonialResponseSchema = z.array(
  TestimonialSchema.pick({
    id: true,
    text: true,
    rating: true,
  }).extend({
    user: z.object({
      userId: z.string(),
      name: z.string(),
    }),
  }),
);

export type GetTestimonialResponse = z.infer<
  typeof GetTestimonialResponseSchema
>;
