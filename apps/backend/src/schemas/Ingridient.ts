import { z } from 'zod';

export const IngredientSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  measure: z.string(),
});

export type Ingredient = z.infer<typeof IngredientSchema>;
