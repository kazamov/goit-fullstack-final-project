import bcrypt from 'bcrypt';
import gravatar from 'gravatar';

import type {
  CreateUserPayload,
  CreateUserResponse,
  UserSchemaAttributes,
} from '@goit-fullstack-final-project/schemas';
import {
  CreateUserResponseSchema,
  UserSchema,
} from '@goit-fullstack-final-project/schemas';

import HttpError from '../../helpers/HttpError.js';
import { UserDTO } from '../../infrastructure/db/index.js';

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

  const hashedPassword = await bcrypt.hash(password, 10);

  const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'retro' });

  const createdUser = await UserDTO.create({
    name,
    email,
    password: hashedPassword,
    avatar,
  });

  return CreateUserResponseSchema.parse(createdUser.toJSON());
}
