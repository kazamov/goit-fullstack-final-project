import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { IngredientDTO } from './Ingredient';
import { RecipeDTO } from './Recipe';

@Table({
  tableName: 'recipe_ingredients',
  timestamps: true,
})
export class RecipeIngredientDTO extends Model {
  @ForeignKey(() => RecipeDTO)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare recipeId: string;

  @ForeignKey(() => IngredientDTO)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare ingredientId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare measure: string;

  @BelongsTo(() => RecipeDTO)
  declare recipe: RecipeDTO;

  @BelongsTo(() => IngredientDTO)
  declare ingredient: IngredientDTO;
}
