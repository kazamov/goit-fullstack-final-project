import { z } from 'zod';

export const IngredientSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  measure: z.string(),
  quantity: z.string(),
  recipeId: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Ingredient = z.infer<typeof IngredientSchema>;
