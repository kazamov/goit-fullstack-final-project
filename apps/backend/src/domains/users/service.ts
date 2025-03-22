import fs from 'fs/promises';

import gravatar from 'gravatar';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import type {
  CreateUserPayload,
  CreateUserResponse,
  CurrentUserDetails,
  GetPaginatedRecipeShort,
  LoginUserPayload,
  LoginUserResponse,
  OtherUserDetails,
  UserFollowers,
  UserFollowings,
  UserSchemaAttributes,
} from '@goit-fullstack-final-project/schemas';
import {
  CreateUserResponseSchema,
  CurrentUserDetailsSchema,
  GetRecipeShortSchema,
  JwtUserSchema,
  LoginUserResponseSchema,
  OtherUserDetailsSchema,
  UserFollowersSchema,
  UserFollowingsSchema,
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

export type OwnRecipeQuery = {
  page?: string | number;
  perPage?: string | number;
};

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

export async function getUserRecipes(
  userId: string,
  query: OwnRecipeQuery,
): Promise<GetPaginatedRecipeShort> {
  // Pagination
  const limit = query.perPage ? Number(query.perPage) : 10;
  const page = query.page ? Number(query.page) : 1;
  const offset = (page - 1) * limit;

  const { count, rows: items } = await RecipeDTO.findAndCountAll({
    where: { userId },
    limit,
    offset,
    order: [['updatedAt', 'DESC']],
  });

  const totalPages = Math.ceil(count / limit);

  return {
    items: GetRecipeShortSchema.array().parse(items),
    page,
    totalPages,
  } as GetPaginatedRecipeShort;
}

export async function getUserFavorites(
  userId: string,
  query: OwnRecipeQuery,
): Promise<GetPaginatedRecipeShort> {
  // Pagination
  const limit = query.perPage ? Number(query.perPage) : 10;
  const page = query.page ? Number(query.page) : 1;
  const offset = (page - 1) * limit;

  const { count, rows } = await RecipeDTO.findAndCountAll({
    include: [
      {
        model: UserDTO,
        as: 'favoritedBy',
        attributes: [],
        through: { attributes: [] },
        where: { id: userId },
        required: true,
      },
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    distinct: true,
  });

  const totalPages = Math.ceil(count / limit);
  const recipes = rows.map((recipe) => recipe.toJSON());

  return {
    items: GetRecipeShortSchema.array().parse(recipes),
    page,
    totalPages,
  } as GetPaginatedRecipeShort;
}

export async function getUserFollowers(
  userId: string,
): Promise<UserFollowers | null> {
  const userWithFollowers = await UserDTO.findByPk(userId, {
    attributes: ['id'],
    include: [
      {
        model: UserDTO,
        as: 'followers',
        attributes: ['id', 'name', 'email', 'avatarUrl'],
        through: { attributes: [] },
        include: [
          {
            model: RecipeDTO,
            as: 'recipes',
            attributes: ['id', 'title', 'thumb'],
            separate: true,
            limit: 10,
            order: [['createdAt', 'DESC']],
          },
        ],
        subQuery: false,
      },
    ],
  });

  if (!userWithFollowers) {
    return null;
  }

  const followerIds = userWithFollowers.followers.map(
    (follower) => follower.id,
  );

  const recipesCounts = (await RecipeDTO.findAll({
    attributes: [
      'userId',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'recipesCount'],
    ],
    where: {
      userId: {
        [Op.in]: followerIds,
      },
    },
    group: ['userId'],
    raw: true,
  })) as unknown as { userId: string; recipesCount: string }[];

  const countsMap = recipesCounts.reduce<Record<string, number>>(
    (map, item) => {
      map[item.userId] = parseInt(item.recipesCount, 10);
      return map;
    },
    {},
  );

  userWithFollowers.followers.forEach((follower) => {
    follower.setDataValue('recipesCount', countsMap[follower.id] || 0);
  });

  return UserFollowersSchema.parse(
    userWithFollowers.followers.map((follower) => follower.toJSON()),
  );
}

export async function updateAvatar(userId: string, file: Express.Multer.File) {
  const fileBuffer = await fs.readFile(file.path);

  const { url: avatarUrl } = await cloudinaryClient.uploadFile({
    name: `${userId}-${file.originalname}`,
    folder: 'avatars',
    content: fileBuffer,
  });

  await UserDTO.update({ avatarUrl }, { where: { id: userId } });

  return avatarUrl;
}

export async function getUserFollowings(
  userId: string,
): Promise<UserFollowings | null> {
  const userWithFollowings = await UserDTO.findByPk(userId, {
    attributes: ['id'],
    include: [
      {
        model: UserDTO,
        as: 'following',
        attributes: ['id', 'name', 'email', 'avatarUrl'],
        through: { attributes: [] },
        include: [
          {
            model: RecipeDTO,
            as: 'recipes',
            attributes: ['id', 'title', 'thumb'],
            separate: true,
            limit: 10,
            order: [['createdAt', 'DESC']],
          },
        ],
        subQuery: false,
      },
    ],
  });

  if (!userWithFollowings) {
    return null;
  }

  const followingIds = userWithFollowings.following.map(
    (following) => following.id,
  );

  const recipesCounts = (await RecipeDTO.findAll({
    attributes: [
      'userId',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'recipesCount'],
    ],
    where: {
      userId: {
        [Op.in]: followingIds,
      },
    },
    group: ['userId'],
    raw: true,
  })) as unknown as { userId: string; recipesCount: string }[];

  const countsMap = recipesCounts.reduce<Record<string, number>>(
    (map, item) => {
      map[item.userId] = parseInt(item.recipesCount, 10);
      return map;
    },
    {},
  );

  userWithFollowings.following.forEach((follower) => {
    follower.setDataValue('recipesCount', countsMap[follower.id] || 0);
  });

  return UserFollowingsSchema.parse(
    userWithFollowings.following.map((follower) => follower.toJSON()),
  );
}

export async function followUser(
  currentUserId: string,
  userId: string,
): Promise<void> {
  const user = await UserDTO.findByPk(userId);

  if (!user) {
    throw new HttpError(`User with id '${userId}' not found`, 404);
  }

  const existingFollower = await UserFollowersDTO.findOne({
    where: { followerId: currentUserId, followingId: userId },
  });

  if (existingFollower) {
    throw new HttpError(`Already following user with id '${userId}'`, 409);
  }

  await UserFollowersDTO.create({
    followerId: currentUserId,
    followingId: userId,
  });
}

export async function unfollowUser(
  currentUserId: string,
  userId: string,
): Promise<void> {
  const user = await UserDTO.findByPk(userId);

  if (!user) {
    throw new HttpError(`User with id '${userId}' not found`, 404);
  }

  const existingFollower = await UserFollowersDTO.findOne({
    where: { followerId: currentUserId, followingId: userId },
  });

  if (!existingFollower) {
    throw new HttpError(`Not following user with id '${userId}'`, 409);
  }

  await existingFollower.destroy();
}
