import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { Recipe } from './Recipe';
import { RecipeIngredient } from './RecipeIngredient';

@Table({
  tableName: 'ingredients',
  timestamps: true,
})
export class Ingredient extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
  })
  declare description?: string;

  @Column({
    type: DataType.STRING,
  })
  declare imageUrl?: string;

  @BelongsToMany(() => Recipe, () => RecipeIngredient)
  declare recipes?: Recipe[];
}
