import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Sequelize,
  Table,
} from 'sequelize-typescript';

import { RecipeDTO } from './Recipe.js';
import { UserDTO } from './User.js';

@Table({
  tableName: 'user_favorite_recipes',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'recipeId'],
    },
  ],
})
export class UserFavoriteRecipesDTO extends Model {
  @Column({
    type: DataType.STRING(24),
    allowNull: false,
    defaultValue: Sequelize.literal("encode(gen_random_bytes(12), 'hex')"),
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => UserDTO)
  @Column({
    type: DataType.STRING(24),
    allowNull: false,
  })
  declare userId: string;

  @ForeignKey(() => RecipeDTO)
  @Column({
    type: DataType.STRING(24),
    allowNull: false,
  })
  declare recipeId: string;
}
