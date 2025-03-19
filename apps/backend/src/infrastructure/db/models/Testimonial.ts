import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Sequelize,
  Table,
} from 'sequelize-typescript';

import { UserDTO } from './User.js';

@Table({
  tableName: 'testimonials',
  timestamps: true,
})
export class TestimonialDTO extends Model {
  @Column({
    type: DataType.STRING(24),
    allowNull: false,
    defaultValue: Sequelize.literal("encode(gen_random_bytes(12), 'hex')"),
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare text: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  })
  declare rating: number;

  @ForeignKey(() => UserDTO)
  @Column({
    type: DataType.STRING(24),
    allowNull: false,
  })
  declare userId: string;

  @BelongsTo(() => UserDTO)
  declare user: UserDTO;
}
