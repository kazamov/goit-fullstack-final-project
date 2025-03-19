import type { GetCategoryResponse } from '@goit-fullstack-final-project/schemas';
import { GetCategoryResponseSchema } from '@goit-fullstack-final-project/schemas';

import { CategoryDTO } from '../../infrastructure/db/index.js';

export async function getCategories(): Promise<GetCategoryResponse> {
  const categories = await CategoryDTO.findAll();
  return GetCategoryResponseSchema.parse(
    categories.map((category) => category.toJSON()),
  );
}
