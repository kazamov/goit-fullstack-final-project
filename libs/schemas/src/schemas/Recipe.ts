import { z } from 'zod';

import { GetIngredientResponseSchema, IngredientSchema } from './Ingredient.js';

export const RecipeSchema = z.object({
  id: z.string(),
  title: z.string(),
  categoryId: z.string(),
  userId: z.string(),
  areaId: z.string(),
  instructions: z.string(),
  description: z.string(),
  thumb: z.string(),
  thumbId: z.string().nullable(),
  time: z.number({ coerce: true }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Recipe = z.infer<typeof RecipeSchema>;

// Get schemas
export const GetRecipeResponseSchema = RecipeSchema.pick({
  id: true,
  title: true,
  description: true,
  thumb: true,
}).extend({
  owner: z.object({
    userId: z.string(),
    name: z.string(),
    avatarUrl: z.string(),
  }),
  category: z.object({
    categoryId: z.string(),
    categoryName: z.string(),
  }),
  area: z.object({
    areaId: z.string(),
    areaName: z.string(),
  }),
});

export type GetRecipeResponse = z.infer<typeof GetRecipeResponseSchema>;

export const GetRecipeShortSchema = RecipeSchema.pick({
  id: true,
  title: true,
  thumb: true,
  description: true,
});

export type GetRecipeShort = z.infer<typeof GetRecipeShortSchema>;

export const GetPaginatedRecipeShortSchema = z.object({
  page: z.number(),
  totalPages: z.number(),
  items: z.array(GetRecipeShortSchema),
});

export type GetPaginatedRecipeShort = z.infer<
  typeof GetPaginatedRecipeShortSchema
>;

export const GetRecipeListResponseSchema = z.array(GetRecipeResponseSchema);

export type GetRecipeListResponse = z.infer<typeof GetRecipeListResponseSchema>;

export const GetPaginatedRecipeResponseSchema = z.object({
  page: z.number(),
  totalPages: z.number(),
  items: GetRecipeListResponseSchema,
});

export type GetPaginatedRecipeResponse = z.infer<
  typeof GetPaginatedRecipeResponseSchema
>;

export const GetRecipeDetailedResponseSchema = RecipeSchema.omit({
  areaId: true,
  categoryId: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  owner: z.object({
    userId: z.string(),
    name: z.string(),
    avatarUrl: z.string(),
  }),
  category: z.object({
    categoryId: z.string(),
    categoryName: z.string(),
  }),
  area: z.object({
    areaId: z.string(),
    areaName: z.string(),
  }),
  ingredients: GetIngredientResponseSchema,
});

export type GetRecipeDetailedResponse = z.infer<
  typeof GetRecipeDetailedResponseSchema
>;

// Create schemas

const RecipeIngredientSchema = IngredientSchema.pick({ id: true }).extend({
  measure: z.string(),
});

export const CreateRecipePayloadSchema = RecipeSchema.omit({
  id: true,
  thumb: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
}).extend({
  ingredients: z.string().transform((val, ctx) => {
    // Attempt to parse the ingredients JSON string into an array
    try {
      const value = JSON.parse(val); // Parse the JSON string

      if (Array.isArray(value)) {
        const ingredients = value.map((ingredient) =>
          RecipeIngredientSchema.parse(ingredient),
        );

        return ingredients;
      } else {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Ingredients must be an array',
        });

        return z.NEVER;
      }
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Cannot parse ingredients',
      });

      return z.NEVER;
    }
  }),
});

export type CreateRecipePayload = z.infer<typeof CreateRecipePayloadSchema>;

export const CreateRecipeResponseSchema = RecipeSchema.omit({
  createdAt: true,
  updatedAt: true,
}).extend({
  ingredients: z.array(RecipeIngredientSchema),
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
