import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  images: z
    .object({
      small: z.string().url().optional(),
      medium: z.string().url().optional(),
      large: z.string().url().optional(),
      xlarge: z.string().url().optional(),
    })
    .optional(),
  recipes: z.array(z.number().int()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Category = z.infer<typeof CategorySchema>;

export const GetCategoryResponseSchema = z.array(
  CategorySchema.pick({
    id: true,
    name: true,
    description: true,
    images: true,
  }),
);

export type GetCategoryResponse = z.infer<typeof GetCategoryResponseSchema>;
