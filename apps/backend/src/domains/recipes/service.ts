import { col, fn, literal } from 'sequelize';

import type {
  CreateRecipePayload,
  CreateRecipeResponse,
  GetPaginatedRecipeResponse,
  GetRecipeDetailedResponse,
  GetRecipeResponse,
  UpdateRecipePayload,
  UpdateRecipeResponse,
} from '@goit-fullstack-final-project/schemas';
import {
  CreateRecipeResponseSchema,
  GetRecipeDetailedResponseSchema,
  GetRecipeResponseSchema,
  UpdateRecipeResponseSchema,
} from '@goit-fullstack-final-project/schemas';

import {
  AreaDTO,
  CategoryDTO,
  IngredientDTO,
  RecipeDTO,
  UserDTO,
  UserFavoriteRecipesDTO,
} from '../../infrastructure/db/index.js';

export type RecipeQuery = {
  categoryId?: string;
  areaId?: string;
  ingredientId?: string;
  page?: string | number;
  perPage?: string | number;
};

export async function getRecipes(
  query: RecipeQuery,
): Promise<GetPaginatedRecipeResponse> {
  // Calculate where
  const where: any = {};
  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }
  if (query.areaId) {
    where.areaId = query.areaId;
  }

  // Pagination
  const limit = query.perPage ? Number(query.perPage) : 10;
  const page = query.page ? Number(query.page) : 1;
  const offset = (page - 1) * limit;

  // Create include
  const include: any[] = [
    {
      model: UserDTO,
      as: 'user',
      attributes: ['avatarUrl', 'name'],
      required: false,
    },
    {
      model: CategoryDTO,
      as: 'category',
      attributes: ['id', 'name'],
      required: false,
    },
    {
      model: AreaDTO,
      as: 'area',
      attributes: ['id', 'name'],
      required: false,
    },
  ];

  if (query.ingredientId) {
    include.push({
      model: IngredientDTO,
      as: 'ingredients',
      where: { id: query.ingredientId },
      through: { attributes: [] },
      required: true,
    });
  }

  // Use method findAndCountAll
  const { count, rows } = await RecipeDTO.findAndCountAll({
    where,
    include,
    limit,
    offset,
    distinct: true,
  });

  const totalPages = Math.ceil(count / limit);
  const items = rows.map((recipe) => {
    const recipeJson = recipe.toJSON() as any;
    const transformedRecipe = {
      ...recipeJson,
      owner: {
        userId: recipeJson.userId,
        name: recipeJson.user?.name || '',
        avatarUrl: recipeJson.user?.avatarUrl || '',
      },
      category: {
        categoryId: recipeJson.category?.id || '',
        categoryName: recipeJson.category?.name || '',
      },
      area: {
        areaId: recipeJson.area?.id || '',
        areaName: recipeJson.area?.name || '',
      },
    };

    return GetRecipeResponseSchema.parse(transformedRecipe);
  });

  return {
    items,
    page,
    totalPages,
  } as GetPaginatedRecipeResponse;
}

export async function getRecipe(
  id: string,
): Promise<GetRecipeDetailedResponse | null> {
  const recipe = await RecipeDTO.findByPk(id, {
    include: [
      {
        model: UserDTO,
        as: 'user',
        attributes: ['avatarUrl', 'name'],
        required: false,
      },
      {
        model: CategoryDTO,
        as: 'category',
        attributes: ['id', 'name'],
        required: false,
      },
      {
        model: AreaDTO,
        as: 'area',
        attributes: ['id', 'name'],
        required: false,
      },
      {
        model: IngredientDTO,
        as: 'ingredients',
        through: { attributes: [] },
        required: false,
      },
    ],
  });

  if (!recipe) {
    return null;
  }

  const recipeJson = recipe.toJSON() as any;
  const transformedRecipe = {
    ...recipeJson,
    owner: {
      userId: recipeJson.userId,
      name: recipeJson.user?.name || '',
      avatarUrl: recipeJson.user?.avatarUrl || '',
    },
    category: {
      categoryId: recipeJson.category?.id || '',
      categoryName: recipeJson.category?.name || '',
    },
    area: {
      areaId: recipeJson.area?.id || '',
      areaName: recipeJson.area?.name || '',
    },
  };

  return GetRecipeDetailedResponseSchema.parse(transformedRecipe);
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
        through: { attributes: [] },
        required: false,
      },
      {
        model: UserDTO,
        as: 'user',
        attributes: ['avatarUrl', 'name'],
        required: false,
      },
      {
        model: CategoryDTO,
        as: 'category',
        attributes: ['id', 'name'],
        required: false,
      },
      {
        model: AreaDTO,
        as: 'area',
        attributes: ['id', 'name'],
        required: false,
      },
    ],
    // For correct ordering we need to use subquery
    group: ['RecipeDTO.id', 'user.id', 'category.id', 'area.id'],
    order: [[literal('"favoritesCount"'), 'DESC']],
    limit: 10,
    subQuery: false,
  });

  const items = recipes.map((recipe) => {
    const recipeJson = recipe.toJSON() as any;
    const transformedRecipe = {
      ...recipeJson,
      owner: {
        userId: recipeJson.userId,
        name: recipeJson.user?.name || '',
        avatarUrl: recipeJson.user?.avatarUrl || '',
      },
      category: {
        categoryId: recipeJson.category?.id || '',
        categoryName: recipeJson.category?.name || '',
      },
      area: {
        areaId: recipeJson.area?.id || '',
        areaName: recipeJson.area?.name || '',
      },
    };
    delete transformedRecipe.user;
    delete transformedRecipe.userId;
    return GetRecipeResponseSchema.parse(transformedRecipe);
  });

  return items;
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

export async function addToFavorites(
  recipeId: string,
  userId: string,
): Promise<UserFavoriteRecipesDTO> {
  return UserFavoriteRecipesDTO.create({
    userId: userId,
    recipeId: recipeId,
  });
}

export async function removeFromFavorites(
  recipeId: string,
  userId: string,
): Promise<number> {
  return UserFavoriteRecipesDTO.destroy({
    where: {
      userId: userId,
      recipeId: recipeId,
    },
  });
}

export async function deleteRecipe(id: string): Promise<number> {
  return RecipeDTO.destroy({ where: { id } });
}
