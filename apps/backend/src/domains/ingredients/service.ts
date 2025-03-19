import type { GetIngredientResponse } from '@goit-fullstack-final-project/schemas';
import { GetIngredientResponseSchema } from '@goit-fullstack-final-project/schemas';

import { IngredientDTO } from '../../infrastructure/db/index.js';

export async function getIngredients(): Promise<GetIngredientResponse> {
  const ingredients = await IngredientDTO.findAll();
  return GetIngredientResponseSchema.parse(
    ingredients.map((ingredient) => ingredient.toJSON()),
  );
}
