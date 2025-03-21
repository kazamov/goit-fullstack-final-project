import { col, fn, literal } from 'sequelize';

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

import { RecipeDTO, UserDTO } from '../../infrastructure/db/index.js';

export async function getRecipes(): Promise<GetRecipeResponse[]> {
  const recipes = await RecipeDTO.findAll();
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

export async function getPopularRecipes(): Promise<GetRecipeResponse[]> {
  const recipes = await RecipeDTO.findAll({
    attributes: {
      include: [
        [
          fn('COUNT', col('favoritedBy->UserFavoriteRecipesDTO.userId')),
          'favoritesCount',
        ],
      ],
    },
    include: [
      {
        model: UserDTO,
        as: 'favoritedBy',
        attributes: [],
        through: {
          attributes: [],
        },
        required: false,
      },
    ],
    group: ['RecipeDTO.id'],
    order: [[literal('"favoritesCount"'), 'DESC']],
    limit: 10,
    subQuery: false,
  });

  return recipes.map((recipe) =>
    GetRecipeResponseSchema.parse(recipe.toJSON()),
  );
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
