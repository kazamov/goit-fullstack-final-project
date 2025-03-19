import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';

import { Area } from './_Area';
import { Category } from './_Category';
import { Ingredient } from './_Ingredient';
import { RecipeIngredient } from './RecipeIngredient';
import { User } from './User';

@Table({
  tableName: 'recipes',
  timestamps: true,
})
export class Recipe extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
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
  declare thumb?: string;

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

  @Column({
    type: DataType.FLOAT,
    defaultValue: 0,
  })
  declare rating: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  declare ratingCount: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare isFavorite?: boolean;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  @BelongsTo(() => User)
  declare user: User;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare categoryId: string;

  @BelongsTo(() => Category)
  declare category: Category;

  @ForeignKey(() => Area)
  @Column({
    type: DataType.UUID,
  })
  declare areaId?: string;

  @BelongsTo(() => Area)
  declare area?: Area;

  @BelongsToMany(() => Ingredient, () => RecipeIngredient)
  declare ingredients?: Ingredient[];

  @HasMany(() => RecipeIngredient)
  declare recipeIngredients?: RecipeIngredient[];

  @BelongsToMany(() => User, 'user_favorite_recipes', 'recipeId', 'userId')
  declare favoritedBy?: User[];
}
