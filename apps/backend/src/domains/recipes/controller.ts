import type { Request, Response } from 'express';

import type {
  CreateRecipePayload,
  UpdateRecipePayload,
  UserSchemaAttributes,
} from '@goit-fullstack-final-project/schemas';

import HttpError from '../../helpers/HttpError.js';
import {
  RecipeDTO,
  UniqueConstraintError,
} from '../../infrastructure/db/index.js';

import * as service from './service.js';

export async function getRecipes(_req: Request, res: Response) {
  const recipes = await service.getRecipes();

  res.json(recipes);
}

export async function getRecipe(req: Request, res: Response) {
  const { params } = req;

  const recipe = await service.getRecipe(params.id);

  if (!recipe) {
    throw new HttpError('Recipe not found', 404);
  }

  res.json({ message: 'Get recipe' });
}

export async function createRecipe(req: Request, res: Response) {
  const { body } = req;

  const recipe = await service.createRecipe(body as CreateRecipePayload);

  res.status(201).json(recipe);
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

  try {
    await service.addToFavorites(recipeId, userId);
    res.status(201).json({ message: 'Recipe added to favorites' });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      throw new HttpError('Recipe is already in favorites', 409);
    }

    console.error(error);
    throw new HttpError(`Internal server error: ${error}`, 500);
  }
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
