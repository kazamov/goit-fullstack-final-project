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

import {
  AreaDTO,
  CategoryDTO,
  IngredientDTO,
  RecipeDTO,
  RecipeIngredientDTO,
} from '../../infrastructure/db/index.js';

export async function getRecipes(
  query: any,
  pagination: { limit?: number; page?: number } = {},
): Promise<GetRecipeResponse[]> {
  const { limit, page } = pagination;
  let offset = 0;
  if (page && limit && typeof page === 'number' && typeof limit === 'number') {
    offset = (page - 1) * (limit ?? 0);
  }
  if (query.area) {
    const area = await AreaDTO.findOne({ where: { name: query.area } });
    if (area) {
      query.areaId = area.id;
    } else {
      query.areaId = null;
    }
    delete query.area;
  }
  if (query.category) {
    const category = await CategoryDTO.findOne({
      where: { name: query.category },
    });
    console.log(category);
    if (category) {
      query.categoryId = category.id;
    } else {
      query.categoryId = null;
    }
    delete query.category;
  }
  if (query.ingredient) {
    const ingredient = await IngredientDTO.findOne({
      where: { name: query.ingredient },
    });
    if (ingredient) {
      const recipesIds = await RecipeIngredientDTO.findAll({
        where: { ingredientId: ingredient.id },
      });
      query.id = recipesIds.map((recipe) => recipe.recipeId);
    }
    delete query.ingredient;
  }
  try {
    const recipes = await RecipeDTO.findAll({
      where: { ...query },
      offset,
      limit,
    });
    return recipes.map((recipe) => recipe.toJSON());
  } catch (error) {
    console.error('Database error occurred', error);
    throw new Error('Database error occurred');
  }
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
