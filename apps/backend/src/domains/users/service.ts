import fs from 'fs/promises';

import gravatar from 'gravatar';

import type {
  CreateUserPayload,
  CreateUserResponse,
  CurrentUserDetails,
  LoginUserPayload,
  LoginUserResponse,
  OtherUserDetails,
  UserSchemaAttributes,
} from '@goit-fullstack-final-project/schemas';
import {
  CreateUserResponseSchema,
  CurrentUserDetailsSchema,
  JwtUserSchema,
  LoginUserResponseSchema,
  OtherUserDetailsSchema,
  UserSchema,
} from '@goit-fullstack-final-project/schemas';

import HttpError from '../../helpers/HttpError.js';
import { createToken } from '../../helpers/jwt.js';
import { hashPassword, verifyPassword } from '../../helpers/password.js';
import { cloudinaryClient } from '../../infrastructure/cloudinaryClient/cloudinaryClient.js';
import { RecipeDTO, UserDTO } from '../../infrastructure/db/index.js';
import { UserFavoriteRecipesDTO } from '../../infrastructure/db/models/UserFavoriteRecipes.js';
import { UserFollowersDTO } from '../../infrastructure/db/models/UserFollowers.js';

type UserQuery =
  | Pick<UserSchemaAttributes, 'email'>
  | Pick<UserSchemaAttributes, 'id'>
  | Pick<UserSchemaAttributes, 'email' | 'id'>;

export async function findUser(
  query: UserQuery,
): Promise<UserSchemaAttributes | null> {
  const user = await UserDTO.findOne({ where: query });

  return user ? UserSchema.parse(user.toJSON()) : null;
}

export async function createUser(
  payload: CreateUserPayload,
): Promise<CreateUserResponse> {
  const { name, email, password } = payload;
  const user = await findUser({ email });

  if (user) {
    throw new HttpError(`User with email '${email}' already exists`, 409);
  }

  const hashedPassword = await hashPassword(password);

  const avatarUrl = gravatar.url(email, { s: '200', r: 'pg', d: 'retro' });

  const createdUser = await UserDTO.create({
    name,
    email,
    password: hashedPassword,
    avatarUrl,
  });

  const jwtPayload = JwtUserSchema.parse(createdUser.toJSON());
  const token = createToken(jwtPayload);

  createdUser.update({ token }, { returning: true });

  return CreateUserResponseSchema.parse(createdUser.toJSON());
}

export async function loginUser(
  payload: LoginUserPayload,
): Promise<LoginUserResponse> {
  const { email, password } = payload;
  const user = await UserDTO.findOne({ where: { email } });

  if (!user) {
    throw new HttpError(`Email or password is incorrect`, 401);
  }

  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    throw new HttpError('Email or password is incorrect', 401);
  }

  const jwtPayload = JwtUserSchema.parse(user.toJSON());
  const token = createToken(jwtPayload);

  await user.update({ token }, { returning: true });

  return LoginUserResponseSchema.parse(user.toJSON());
}

export async function logoutUser(id: string): Promise<void> {
  await UserDTO.update({ token: null }, { where: { id } });
}

export async function getUserDetails(
  userId: string,
  currentUserId: string,
): Promise<CurrentUserDetails | OtherUserDetails | null> {
  const [
    user,
    recipesCount,
    favoriteRecipesCount,
    followersCount,
    followingCount,
  ] = await Promise.all([
    UserDTO.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'avatarUrl'],
    }),
    RecipeDTO.count({ where: { userId } }),
    UserFavoriteRecipesDTO.count({ where: { userId } }),
    UserFollowersDTO.count({ where: { followingId: userId } }),
    UserFollowersDTO.count({ where: { followerId: userId } }),
  ]);

  if (!user) {
    return null;
  }

  const result = user.toJSON();
  result.recipes_count = recipesCount;
  result.favorite_recipes_count = favoriteRecipesCount;
  result.followers_count = followersCount;
  result.following_count = followingCount;

  return userId === currentUserId
    ? CurrentUserDetailsSchema.parse({
        ...(user.toJSON() as object),
        recipesCount,
        favoriteRecipesCount,
        followersCount,
        followingCount,
      })
    : OtherUserDetailsSchema.parse({
        ...(user.toJSON() as object),
        recipesCount,
        favoriteRecipesCount,
        followersCount,
      });
}

export async function updateAvatar(userId: string, file: Express.Multer.File) {
  if (!file) {
    throw new HttpError('File is required', 400);
  }

  const fileBuffer = await fs.readFile(file.path);

  const avatarUrl = await cloudinaryClient.uploadFile({
    name: `${userId}-${file.originalname}`,
    folder: 'avatars',
    content: fileBuffer,
  });

  await UserDTO.update({ avatarUrl }, { where: { id: userId } });

  return avatarUrl;
}
