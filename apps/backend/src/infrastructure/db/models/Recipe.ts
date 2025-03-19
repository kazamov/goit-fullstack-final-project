import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'recipes', timestamps: true })
export class RecipeDTO extends Model {
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare category: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare owner: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare area: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare instructions: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare description: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare thumb: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare time: string;
}
