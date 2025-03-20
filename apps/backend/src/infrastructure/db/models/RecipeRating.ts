import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { RecipeDTO } from './Recipe.js';
import { UserDTO } from './User.js';

@Table({
  tableName: 'recipe_ratings',
  timestamps: true,
})
export class RecipeRatingDTO extends Model {
  @ForeignKey(() => UserDTO)
  @Column({
    type: DataType.STRING(24),
    allowNull: false,
  })
  declare userId: string;

  @BelongsTo(() => UserDTO)
  declare user: UserDTO;

  @ForeignKey(() => RecipeDTO)
  @Column({
    type: DataType.STRING(24),
    allowNull: false,
  })
  declare recipeId: string;

  @BelongsTo(() => RecipeDTO) // TODO figure out if this is necessary (we need only recipe ID on get)
  declare recipe: RecipeDTO;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  })
  declare rating: number;
}
