import { z } from 'zod';

export const recipeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  owner: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const recipePublicSchema = recipeSchema.omit({
  createdAt: true,
  updatedAt: true,
});
