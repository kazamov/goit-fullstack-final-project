import type {
  CreateRecipePayload,
  CreateRecipeResponse,
  GetRecipeResponse,
  UpdateRecipePayload,
  UpdateRecipeResponse,
} from '@goit-fullstack-final-project/schemas';
import {
  CreateRecipeResponseSchema,
  GetRecipeResponseSchema,
  UpdateRecipeResponseSchema,
} from '@goit-fullstack-final-project/schemas';

import { RecipeDTO } from '../../infrastructure/db/index.js';
interface QueryParams {
  [key: string]: any;
}

interface PaginationParams {
  limit: number | undefined;
  page: number | undefined;
}
export async function getRecipes(
  query: QueryParams,
  pagination: PaginationParams,
): Promise<GetRecipeResponse[]> {
  const { limit, page } = pagination;
  let offset = 0;
  if (page && limit && typeof page === 'number' && typeof limit === 'number') {
    offset = (page - 1) * (limit ?? 0);
  }
  const recipes = await RecipeDTO.findAll({ where: query, offset, limit });
  return recipes.map((recipe) =>
    GetRecipeResponseSchema.parse(recipe.toJSON()),
  );
}

export async function getRecipe(id: string): Promise<GetRecipeResponse | null> {
  const recipe = await RecipeDTO.findByPk(id);

  if (!recipe) {
    return null;
  }

  return GetRecipeResponseSchema.parse(recipe.toJSON());
}

export async function createRecipe(
  payload: CreateRecipePayload,
): Promise<CreateRecipeResponse> {
  const recipe = await RecipeDTO.create(payload);

  return CreateRecipeResponseSchema.parse(recipe.toJSON());
}

export async function updateRecipe(
  id: string,
  payload: UpdateRecipePayload,
): Promise<UpdateRecipeResponse | null> {
  const recipe = await RecipeDTO.findByPk(id);

  if (!recipe) {
    return null;
  }

  const updatedRecipe = await recipe.update(payload);

  return UpdateRecipeResponseSchema.parse(updatedRecipe.toJSON());
}

export async function deleteRecipe(id: string): Promise<number> {
  return RecipeDTO.destroy({ where: { id } });
}
