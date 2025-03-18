import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'users', timestamps: true })
export class UserDTO extends Model {
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;
}
