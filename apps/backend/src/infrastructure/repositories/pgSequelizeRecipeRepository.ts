import { Column, DataType, Model, Table } from 'sequelize-typescript';

import type { RecipesRepository } from '../../app/interfaces';
import { Recipe } from '../../domain/domain';

@Table({ tableName: 'recipes', timestamps: true })
export class RecipePgDTO extends Model {
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.TEXT })
  description!: string;
}

export class PgSequelizeRecipeRepository implements RecipesRepository {
  async getAll(): Promise<Recipe[]> {
    const recipes = await RecipePgDTO.findAll();
    return recipes.map(convertRecipeDTOtoRecipe);
  }
}

function convertRecipeDTOtoRecipe(recipeDTO: RecipePgDTO): Recipe {
  return new Recipe({
    id: recipeDTO.id,
    title: recipeDTO.name,
    description: recipeDTO.description,
    createdAt: recipeDTO.createdAt,
    updatedAt: recipeDTO.updatedAt,
  });
}
