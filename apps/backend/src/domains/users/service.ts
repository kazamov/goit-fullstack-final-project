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
  PaginatedUserFollowers,
  PaginatedUserFollowings,
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
import { CloudinaryClient } from '../../infrastructure/cloudinaryClient/cloudinaryClient.js';
import { RecipeDTO, UserDTO } from '../../infrastructure/db/index.js';
import { UserFavoriteRecipesDTO } from '../../infrastructure/db/models/UserFavoriteRecipes.js';
import { UserFollowersDTO } from '../../infrastructure/db/models/UserFollowers.js';

type UserQuery =
  | Pick<UserSchemaAttributes, 'email'>
  | Pick<UserSchemaAttributes, 'id'>
  | Pick<UserSchemaAttributes, 'email' | 'id'>;

export type PagingQuery = {
  page?: string | number;
  perPage?: string | number;
};

const cloudinaryClient = CloudinaryClient.getInstance();

export async function findUser(
  query: UserQuery,
): Promise<UserSchemaAttributes | null> {
  const user = await UserDTO.findOne({ where: query });

  return user ? UserSchema.parse(user.toJSON()) : null;
}

export async function createUser(
  payload: CreateUserPayload,
): Promise<[CreateUserResponse, string]> {
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

  return [CreateUserResponseSchema.parse(createdUser.toJSON()), token];
}

export async function loginUser(
  payload: LoginUserPayload,
): Promise<[LoginUserResponse, string]> {
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

  return [LoginUserResponseSchema.parse(user.toJSON()), token];
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
    following,
  ] = await Promise.all([
    UserDTO.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'avatarUrl'],
    }),
    RecipeDTO.count({ where: { userId } }),
    UserFavoriteRecipesDTO.count({ where: { userId } }),
    UserFollowersDTO.count({ where: { followingId: userId } }),
    UserFollowersDTO.count({ where: { followerId: userId } }),
    UserFollowersDTO.findOne({
      where: {
        followerId: currentUserId,
        followingId: userId,
      },
    }),
  ]);

  if (!user) {
    return null;
  }

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
        following: Boolean(following),
      });
}

export async function getUserRecipes(
  userId: string,
  query: PagingQuery,
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
  query: PagingQuery,
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
  currentUserId: string,
  query: PagingQuery,
): Promise<PaginatedUserFollowers> {
  const limit = query.perPage ? Number(query.perPage) : 10;
  const page = query.page ? Number(query.page) : 1;
  const offset = (page - 1) * limit;

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
      },
    ],
  });

  if (!userWithFollowers) return { page, totalPages: 1, items: [] };

  const fullFollowers = userWithFollowers.followers || [];
  const paginatedFollowers = fullFollowers.slice(offset, offset + limit);

  const followerIds = paginatedFollowers.map((f) => f.id);

  const currentUserFollows = await UserFollowersDTO.findAll({
    attributes: ['followingId'],
    where: {
      followerId: currentUserId,
      followingId: { [Op.in]: followerIds },
    },
    raw: true,
  });

  const followingSet = new Set(currentUserFollows.map((f) => f.followingId));

  const recipeCounts = (await RecipeDTO.findAll({
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

  const countMap = recipeCounts.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.userId] = parseInt(curr.recipesCount, 10);
    return acc;
  }, {});

  paginatedFollowers.forEach((f) => {
    f.setDataValue('recipesCount', countMap[f.id] || 0);
    f.setDataValue('following', followingSet.has(f.id));
  });

  return {
    page,
    totalPages: Math.ceil(fullFollowers.length / limit),
    items: UserFollowersSchema.parse(paginatedFollowers.map((f) => f.toJSON())),
  };
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
  currentUserId: string,
  query: PagingQuery,
): Promise<PaginatedUserFollowings> {
  const limit = query.perPage ? Number(query.perPage) : 10;
  const page = query.page ? Number(query.page) : 1;
  const offset = (page - 1) * limit;

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
      },
    ],
  });

  if (!userWithFollowings) return { page, totalPages: 1, items: [] };

  const fullFollowings = userWithFollowings.following || [];
  const paginatedFollowings = fullFollowings.slice(offset, offset + limit);

  const followingIds = paginatedFollowings.map((f) => f.id);

  const currentUserFollows = await UserFollowersDTO.findAll({
    attributes: ['followingId'],
    where: {
      followerId: currentUserId,
      followingId: { [Op.in]: followingIds },
    },
    raw: true,
  });

  const followingSet = new Set(currentUserFollows.map((f) => f.followingId));

  const recipeCounts = (await RecipeDTO.findAll({
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

  const countMap = recipeCounts.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.userId] = parseInt(curr.recipesCount, 10);
    return acc;
  }, {});

  paginatedFollowings.forEach((f) => {
    f.setDataValue('recipesCount', countMap[f.id] || 0);
    f.setDataValue('following', followingSet.has(f.id));
  });

  return {
    page,
    totalPages: Math.ceil(fullFollowings.length / limit),
    items: UserFollowingsSchema.parse(
      paginatedFollowings.map((f) => f.toJSON()),
    ),
  };
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
