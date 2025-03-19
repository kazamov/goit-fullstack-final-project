import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';

import { RecipeDTO } from './Recipe.js';

@Table({
  tableName: 'areas',
  timestamps: true,
})
export class AreaDTO extends Model {
  @Column({
    type: DataType.STRING(24),
    allowNull: false,
    defaultValue: "encode(gen_random_bytes(12), 'hex')",
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
  declare recipes: RecipeDTO[];
}
