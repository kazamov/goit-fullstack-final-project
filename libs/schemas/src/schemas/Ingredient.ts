import { z } from 'zod';

export const IngredientSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Ingredient = z.infer<typeof IngredientSchema>;

export const GetIngredient = IngredientSchema.pick({
  id: true,
  name: true,
  description: true,
  imageUrl: true,
});

export const GetIngredientResponseSchema = z.array(GetIngredient);

export type GetIngredientResponse = z.infer<typeof GetIngredientResponseSchema>;

export const IngredientCardObjectSchema = IngredientSchema.pick({
  id: true,
  name: true,
  imageUrl: true,
}).extend({
  measure: z.string(),
});

export type IngredientCardObject = z.infer<typeof IngredientCardObjectSchema>;
