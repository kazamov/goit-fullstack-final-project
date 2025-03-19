import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';

import { RecipeDTO } from './Recipe';

@Table({
  tableName: 'categories',
  timestamps: true,
})
export class CategoryDTO extends Model {
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

  @HasMany(() => RecipeDTO)
  declare recipes?: RecipeDTO[];
}
