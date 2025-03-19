import { Column, DataType, Model, Table } from 'sequelize-typescript';

import type { RecipesRepository } from '../../app/interfaces';
import type { Recipe } from '../../domain/domain';
import { RecipeSchema } from '../../domain/domain';

@Table({ tableName: 'recipes', timestamps: true })
export class RecipePgDTO extends Model {
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.TEXT })
  declare description: string;
}

export class PgSequelizeRecipeRepository implements RecipesRepository {
  async getAll(): Promise<Recipe[]> {
    if (!RecipePgDTO.sequelize) {
      throw new Error(
        'RecipePgDTO is not registered in Sequelize. Ensure models are registered.',
      );
    }

    const recipes = await RecipePgDTO.findAll();

    if (!recipes.length) {
      console.warn('getAll(): No recipes found in the database.');
    }

    return recipes.map(convertRecipeDTOtoRecipe);
  }
}

function convertRecipeDTOtoRecipe(recipeDTO: RecipePgDTO): Recipe {
  const jsonData = recipeDTO.get({ plain: true });

  return RecipeSchema.parse(jsonData);
}
