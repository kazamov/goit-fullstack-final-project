import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { Ingredient } from './_Ingredient';
import { Recipe } from './Recipe';

@Table({
  tableName: 'recipe_ingredients',
  timestamps: true,
})
export class RecipeIngredient extends Model {
  @ForeignKey(() => Recipe)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare recipeId: string;

  @ForeignKey(() => Ingredient)
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

  @BelongsTo(() => Recipe)
  declare recipe: Recipe;

  @BelongsTo(() => Ingredient)
  declare ingredient: Ingredient;
}
