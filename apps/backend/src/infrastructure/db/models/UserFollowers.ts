import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Sequelize,
  Table,
} from 'sequelize-typescript';

import { UserDTO } from './User.js';

@Table({ tableName: 'user_followers', timestamps: false })
export class UserFollowersDTO extends Model {
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
  declare followerId: string;

  @ForeignKey(() => UserDTO)
  @Column({
    type: DataType.STRING(24),
    allowNull: false,
  })
  declare followingId: string;
}
