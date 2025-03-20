import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  recipes: z.array(z.number().int()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Category = z.infer<typeof CategorySchema>;

export const GetCategoryResponseSchema = z.array(
  CategorySchema.pick({
    id: true,
    name: true,
  }),
);

export type GetCategoryResponse = z.infer<typeof GetCategoryResponseSchema>;
