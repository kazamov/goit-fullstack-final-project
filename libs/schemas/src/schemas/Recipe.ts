import { z } from 'zod';

export const RecipeSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  category: z.string(),
  owner: z.string(),
  area: z.string(),
  instructions: z.string(),
  description: z.string(),
  thumb: z.string(),
  time: z.string(),
  // ingredients: z.array(IngredientSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Recipe = z.infer<typeof RecipeSchema>;

// Get schemas
export const GetRecipeResponseSchema = RecipeSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export type GetRecipeResponse = z.infer<typeof GetRecipeResponseSchema>;

export const GetRecipeListResponseSchema = z.array(GetRecipeResponseSchema);

export type GetRecipeListResponse = z.infer<typeof GetRecipeListResponseSchema>;

// Create schemas
export const CreateRecipePayloadSchema = RecipeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateRecipePayload = z.infer<typeof CreateRecipePayloadSchema>;

export const CreateRecipeResponseSchema = RecipeSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export type CreateRecipeResponse = z.infer<typeof CreateRecipeResponseSchema>;

// Update schemas
export const UpdateRecipePayloadSchema = RecipeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type UpdateRecipePayload = z.infer<typeof UpdateRecipePayloadSchema>;

export const UpdateRecipeResponseSchema = RecipeSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export type UpdateRecipeResponse = z.infer<typeof UpdateRecipeResponseSchema>;
