import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Sequelize,
  Table,
} from 'sequelize-typescript';

import { AreaDTO } from './Area.js';
import { CategoryDTO } from './Category.js';
import { IngredientDTO } from './Ingredient.js';
import { RecipeIngredientDTO } from './RecipeIngredient.js';
import { RecipeRatingDTO } from './RecipeRating.js';
import { UserDTO } from './User.js';
import { UserFavoriteRecipesDTO } from './UserFavoriteRecipes.js';

@Table({
  tableName: 'recipes',
  timestamps: true,
})
export class RecipeDTO extends Model {
  @Column({
    type: DataType.STRING(24),
    allowNull: false,
    defaultValue: Sequelize.literal("encode(gen_random_bytes(12), 'hex')"),
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
  })
  declare description?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare instructions: string;

  @Column({
    type: DataType.STRING,
  })
  declare thumb: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  declare time: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 1,
  })
  declare servings: number;

  @Column({
    type: DataType.ENUM('easy', 'medium', 'hard'),
    defaultValue: 'medium',
  })
  declare difficulty?: string;

  @ForeignKey(() => UserDTO)
  @Column({
    type: DataType.STRING(24),
    allowNull: false,
  })
  declare userId: string;

  @BelongsTo(() => UserDTO)
  declare user: UserDTO;

  @ForeignKey(() => CategoryDTO)
  @Column({
    type: DataType.STRING(24),
    allowNull: false,
  })
  declare categoryId: string;

  @BelongsTo(() => CategoryDTO)
  declare category: CategoryDTO;

  @ForeignKey(() => AreaDTO)
  @Column({
    type: DataType.STRING(24),
  })
  declare areaId?: string;

  @BelongsTo(() => AreaDTO)
  declare area?: AreaDTO;

  @BelongsToMany(() => IngredientDTO, () => RecipeIngredientDTO)
  declare ingredients?: IngredientDTO[];

  @HasMany(() => RecipeIngredientDTO)
  declare recipeIngredients?: RecipeIngredientDTO[];

  @BelongsToMany(
    () => UserDTO,
    () => UserFavoriteRecipesDTO,
    'recipeId',
    'userId',
  )
  declare favoritedBy?: UserDTO[];

  @HasMany(() => RecipeRatingDTO)
  declare ratings?: RecipeRatingDTO[];
}
