import { z } from 'zod';

export const RecipeSchema = z.object({
  id: z.string(),
  title: z.string(),
  categoryId: z.string(),
  userId: z.string(),
  areaId: z.string(),
  instructions: z.string(),
  description: z.string(),
  thumb: z.string(),
  time: z.number(),
  // ingredients: z.array(IngredientSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Recipe = z.infer<typeof RecipeSchema>;

// Get schemas
export const GetRecipeResponseSchema = RecipeSchema.omit({
  userId: true,
  instructions: true,
  time: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  owner: z.object({
    userId: z.string(),
    name: z.string(),
    avatarUrl: z.string(),
  }),
});

export type GetRecipeResponse = z.infer<typeof GetRecipeResponseSchema>;

export const GetRecipeListResponseSchema = z.array(GetRecipeResponseSchema);

export type GetRecipeListResponse = z.infer<typeof GetRecipeListResponseSchema>;

export const GetPaginatedRecipeResponseSchema = z.object({
  items: GetRecipeListResponseSchema,
  page: z.number(),
  totalPages: z.number(),
});

export type GetPaginatedRecipeResponse = z.infer<
  typeof GetPaginatedRecipeResponseSchema
>;

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

// Short details schemas
export const ShortRecipeDetailsSchema = RecipeSchema.pick({
  id: true,
  title: true,
  thumb: true,
});

export type ShortRecipeDetails = z.infer<typeof ShortRecipeDetailsSchema>;
