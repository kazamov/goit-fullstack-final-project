import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';

import { Testimonial } from './_Testimonial';
import { Recipe } from './Recipe';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
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
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
  })
  declare avatarUrl?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare isVerified: boolean;

  @Column({
    type: DataType.STRING,
  })
  declare verificationToken?: string;

  @Column({
    type: DataType.STRING,
  })
  declare refreshToken?: string;

  @HasMany(() => Recipe)
  declare recipes?: Recipe[];

  @HasMany(() => Testimonial)
  declare testimonials?: Testimonial[];

  @BelongsToMany(() => Recipe, 'user_favorite_recipes', 'userId', 'recipeId')
  declare favoriteRecipes?: Recipe[];
}
