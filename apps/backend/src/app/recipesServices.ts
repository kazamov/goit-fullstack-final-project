import type { Recipe } from '../domain/domain';

import type { RecipesRepository } from './interfaces';

class RecipesService {
  private repo: RecipesRepository;

  constructor(recipesRepository: RecipesRepository) {
    this.repo = recipesRepository;
  }

  public async getAllRecipes(): Promise<Recipe[]> {
    return this.repo.getAll();
  }
}

export default RecipesService;
