import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string().nonempty(),
  avatarUrl: z.string(),
  token: z.string().nullable(),
  // favorite_recipes: z.array(z.number().int()),
  // following: z.array(z.number().int()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

export type UserSchemaAttributes = z.infer<typeof UserSchema>;

export const JwtUserSchema = UserSchema.pick({ email: true, id: true });

export type JwtUserPayload = z.infer<typeof JwtUserSchema>;

// Get schemas
export const GetCurrentUserResponseSchema = UserSchema.pick({
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
});

// Create schemas
export const CreateUserPayloadSchema = UserSchema.pick({
  name: true,
  email: true,
  password: true,
});

export type CreateUserPayload = z.infer<typeof CreateUserPayloadSchema>;

export const CreateUserResponseSchema = UserSchema.pick({
  id: true,
  name: true,
  email: true,
});

export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;

export const LoginUserPayloadSchema = UserSchema.pick({
  email: true,
  password: true,
});

export type LoginUserPayload = z.infer<typeof LoginUserPayloadSchema>;

export const LoginUserResponseSchema = UserSchema.pick({
  id: true,
  name: true,
  email: true,
  token: true,
  avatarUrl: true,
});

export type LoginUserResponse = z.infer<typeof LoginUserResponseSchema>;

// Update schemas

// Details schemas
export const CurrentUserDetailsSchema = UserSchema.pick({
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
}).extend({
  recipesCount: z.number().int().nonnegative(),
  favoriteRecipesCount: z.number().int().nonnegative(),
  followersCount: z.number().int().nonnegative(),
  followingCount: z.number().int().nonnegative(),
});

export type CurrentUserDetails = z.infer<typeof CurrentUserDetailsSchema>;

export const OtherUserDetailsSchema = CurrentUserDetailsSchema.omit({
  followingCount: true,
});

export type OtherUserDetails = z.infer<typeof OtherUserDetailsSchema>;
