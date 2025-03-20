import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Sequelize,
  Table,
} from 'sequelize-typescript';

import { RecipeDTO } from './Recipe.js';
import { TestimonialDTO } from './Testimonial.js';
import { UserFollowersDTO } from './UserFollowers.js';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class UserDTO extends Model {
  @Column({
    type: DataType.STRING(24),
    allowNull: false,
    defaultValue: Sequelize.literal("encode(gen_random_bytes(12), 'hex')"),
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
    allowNull: false,
  })
  declare avatarUrl: string;

  @Column({
    type: DataType.STRING,
    defaultValue: null,
  })
  declare token?: string;

  @HasMany(() => RecipeDTO)
  declare recipes?: RecipeDTO[];

  @HasMany(() => TestimonialDTO)
  declare testimonials?: TestimonialDTO[];

  @BelongsToMany(() => RecipeDTO, 'user_favorite_recipes', 'userId', 'recipeId')
  declare favoriteRecipes?: RecipeDTO[];

  @BelongsToMany(
    () => UserDTO,
    () => UserFollowersDTO,
    'followingId',
    'followerId',
  )
  declare followers: UserDTO[];

  @BelongsToMany(
    () => UserDTO,
    () => UserFollowersDTO,
    'followerId',
    'followingId',
  )
  declare following: UserDTO[];
}
