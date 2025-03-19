import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { RecipeDTO } from './Recipe.js';
import { RecipeIngredientDTO } from './RecipeIngredient.js';

@Table({
  tableName: 'ingredients',
  timestamps: true,
})
export class IngredientDTO extends Model {
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

  @BelongsToMany(() => RecipeDTO, () => RecipeIngredientDTO)
  declare recipes?: RecipeDTO[];
}
