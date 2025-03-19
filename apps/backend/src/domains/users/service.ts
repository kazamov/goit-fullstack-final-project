import { compare, genSalt, hash } from 'bcrypt-ts';
import gravatar from 'gravatar';

import type {
  CreateUserPayload,
  CreateUserResponse,
  LoginUserPayload,
  LoginUserResponse,
  UserSchemaAttributes,
} from '@goit-fullstack-final-project/schemas';
import {
  CreateUserResponseSchema,
  JwtUserSchema,
  LoginUserResponseSchema,
  UserSchema,
} from '@goit-fullstack-final-project/schemas';

import HttpError from '../../helpers/HttpError.js';
import { createToken } from '../../helpers/jwt.js';
import { UserDTO } from '../../infrastructure/db/index.js';

type UserQuery =
  | Pick<UserSchemaAttributes, 'email'>
  | Pick<UserSchemaAttributes, 'id'>
  | Pick<UserSchemaAttributes, 'email' | 'id'>;

export async function hashPassword(password: string): Promise<string> {
  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return compare(password, hashedPassword);
}

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
