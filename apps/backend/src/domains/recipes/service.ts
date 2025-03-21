import fs from 'fs/promises';

import type { Includeable, Transaction, WhereOptions } from 'sequelize';
import { col, fn, literal } from 'sequelize';

import type {
  CreateRecipePayload,
  CreateRecipeResponse,
  GetPaginatedRecipeResponse,
  GetRecipeDetailedResponse,
  GetRecipeResponse,
  Recipe,
  UpdateRecipePayload,
  UpdateRecipeResponse,
} from '@goit-fullstack-final-project/schemas';
import {
  CreateRecipeResponseSchema,
  GetRecipeDetailedResponseSchema,
  GetRecipeResponseSchema,
  UpdateRecipeResponseSchema,
} from '@goit-fullstack-final-project/schemas';

import HttpError from '../../helpers/HttpError.js';
import { cloudinaryClient } from '../../infrastructure/cloudinaryClient/cloudinaryClient.js';
import {
  AreaDTO,
  CategoryDTO,
  IngredientDTO,
  RecipeDTO,
  RecipeIngredientDTO,
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
  const where: WhereOptions<Recipe> = {};
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
  const include: Includeable[] = [
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
    const recipeJson = recipe.toJSON();
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

  const recipeJson = recipe.toJSON();
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
    const recipeJson = recipe.toJSON();
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
  userId: string,
  payload: CreateRecipePayload,
  thumbFile: Express.Multer.File,
): Promise<CreateRecipeResponse> {
  const { ingredients, ...otherProps } = payload;

  let thumb = '';
  let thumbId = '';
  try {
    const fileBuffer = await fs.readFile(thumbFile.path);

    const { url, publicId } = await cloudinaryClient.uploadFile({
      name: `${userId}-${thumbFile.originalname}`,
      folder: 'avatars',
      content: fileBuffer,
    });
    thumb = url;
    thumbId = publicId;
  } catch {
    throw new HttpError(`Error uploading file to cloudinary`, 500);
  } finally {
    await fs.unlink(thumbFile.path as string);
  }

  const transaction = (await RecipeDTO.sequelize?.transaction()) as Transaction;

  try {
    // 0. Validate all ingredients exist before proceeding
    if (ingredients.length > 0) {
      const ingredientIds = ingredients.map((ing) => ing.id);

      // Count how many of the provided ingredient IDs exist in the database
      const existingIngredientsCount = await IngredientDTO.count({
        where: {
          id: ingredientIds,
        },
        transaction,
      });

      // If the count doesn't match, some ingredients don't exist
      if (existingIngredientsCount !== ingredientIds.length) {
        throw new HttpError(
          'One or more ingredients do not exist in the database',
          400,
        );
      }
    }

    // 1. Validate Area and Category IDs
    if (otherProps.areaId) {
      const area = await AreaDTO.findByPk(otherProps.areaId, {
        transaction,
      });
      if (!area) {
        throw new HttpError('Area not found', 400);
      }
    }
    if (otherProps.categoryId) {
      const category = await CategoryDTO.findByPk(otherProps.categoryId, {
        transaction,
      });
      if (!category) {
        throw new HttpError('Category not found', 400);
      }
    }

    // 2. Create the recipe
    const recipe = await RecipeDTO.create(
      {
        ...otherProps,
        userId,
        thumb,
      },
      { transaction },
    );

    // 3. Create recipe ingredients with the new recipe ID
    if (ingredients && ingredients.length > 0) {
      const recipeIngredients = ingredients.map((ingredient) => ({
        recipeId: recipe.id,
        ingredientId: ingredient.id,
        measure: ingredient.measure,
      }));

      await RecipeIngredientDTO.bulkCreate(recipeIngredients, { transaction });
    }

    // Commit transaction
    await transaction.commit();

    // Return the created recipe
    return CreateRecipeResponseSchema.parse(recipe.toJSON());
  } catch (error) {
    await Promise.all([
      transaction.rollback(),
      cloudinaryClient.deleteFile(thumbId),
    ]);

    throw error;
  }
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
