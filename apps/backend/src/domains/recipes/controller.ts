import type { Request, Response } from 'express';

import type {
  CreateRecipePayload,
  UpdateRecipePayload,
  UserSchemaAttributes,
} from '@goit-fullstack-final-project/schemas';

import HttpError from '../../helpers/HttpError.js';
import { RecipeDTO } from '../../infrastructure/db/index.js';

import type { RecipeQuery } from './service.js';
import * as service from './service.js';

export async function getRecipes(req: Request, res: Response) {
  // Example: /api/recipes?page=1&perPage=5&areaId=6462a6f04c3d0ddd28897f9b&categoryId=6462a6cd4c3d0ddd28897f98&ingredientId=640c2dd963a319ea671e377e
  const query = req.query as RecipeQuery;
  const result = await service.getRecipes(query);
  res.json(result);
}

export async function getRecipe(req: Request, res: Response) {
  const { params } = req;

  const recipe = await service.getRecipe(params.id);

  if (!recipe) {
    throw new HttpError('Recipe not found', 404);
  }

  res.json(recipe);
}

export async function getPopularRecipes(req: Request, res: Response) {
  const recipes = await service.getPopularRecipes();
  res.json(recipes);
}

export async function createRecipe(req: Request, res: Response) {
  const { body, file } = req;

  if (!file) {
    throw new HttpError('Thumb is required', 400);
  }

  const { id } = req.user as UserSchemaAttributes;

  const recipe = await service.createRecipe(
    id,
    body as CreateRecipePayload,
    file,
  );
  res.status(200).json(recipe);
}

export async function updateRecipe(req: Request, res: Response) {
  const { body, params } = req;

  const recipe = await service.updateRecipe(
    params.id,
    body as UpdateRecipePayload,
  );

  if (!recipe) {
    throw new HttpError('Recipe not found', 404);
  }

  res.json({ message: 'Update recipe' });
}

export async function addRecipeToFavorites(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = (req.user as UserSchemaAttributes).id;
  const recipeId = req.params.id;

  const recipe = await RecipeDTO.findByPk(recipeId);
  if (!recipe) {
    throw new HttpError('Recipe not found', 404);
  }

  await service.addToFavorites(recipeId, userId);
  res.status(201).json({ message: 'Recipe added to favorites' });
}

export async function removeRecipeFromFavorites(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = (req.user as UserSchemaAttributes).id;
  const recipeId = req.params.id;

  const recipe = await RecipeDTO.findByPk(recipeId);
  if (!recipe) {
    throw new HttpError('Recipe not found', 404);
  }

  const deletedCount = await service.removeFromFavorites(recipeId, userId);
  if (deletedCount === 0) {
    throw new HttpError('Recipe was not in favorites', 404);
  }

  res.status(204).send();
}

export async function deleteRecipe(req: Request, res: Response) {
  const { params } = req;

  const numberOfRecords = await service.deleteRecipe(params.id);

  if (!numberOfRecords) {
    throw new HttpError('Recipe not found', 404);
  }

  res.json({ success: true });
}
