import type { Request, Response } from 'express';

import type {
  CreateRecipePayload,
  UpdateRecipePayload,
} from '@goit-fullstack-final-project/schemas';

import HttpError from '../../helpers/HttpError.js';

import * as service from './service.js';

export async function getRecipes(req: Request, res: Response) {
  const {
    query: { limit, page, ...restQuery },
  } = req;
  const pagination = {
    limit: limit ? Number(limit) : undefined,
    page: page ? Number(page) : undefined,
  };
  const query = restQuery;
  const recipes = await service.getRecipes(query, pagination);

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

export async function deleteRecipe(req: Request, res: Response) {
  const { params } = req;

  const numberOfRecords = await service.deleteRecipe(params.id);

  if (!numberOfRecords) {
    throw new HttpError('Recipe not found', 404);
  }

  res.json({ success: true });
}
