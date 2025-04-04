import { z } from 'zod';

import { ShortRecipeDetailsSchema } from './Recipe.js';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().nonempty('Name cannot be empty'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  avatarUrl: z.string(),
  token: z.string().nullable(),
  // favorite_recipes: z.array(z.number().int()),
  // following: z.array(z.number().int()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserSchemaAttributes = z.infer<typeof UserSchema>;

export const JwtUserSchema = UserSchema.pick({ email: true, id: true });

export type JwtUserPayload = z.infer<typeof JwtUserSchema>;

// Get schemas
const UserShortDetailsSchema = UserSchema.pick({
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
});

export type UserShortDetails = z.infer<typeof UserShortDetailsSchema>;

export const GetCurrentUserResponseSchema = UserShortDetailsSchema;

export type GetCurrentUserResponse = z.infer<
  typeof GetCurrentUserResponseSchema
>;

// Create schemas
export const CreateUserPayloadSchema = UserSchema.pick({
  name: true,
  email: true,
  password: true,
});

export type CreateUserPayload = z.infer<typeof CreateUserPayloadSchema>;

export const CreateUserResponseSchema = UserShortDetailsSchema;

export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;

export const LoginUserPayloadSchema = UserSchema.pick({
  email: true,
  password: true,
});

export type LoginUserPayload = z.infer<typeof LoginUserPayloadSchema>;

export const LoginUserResponseSchema = UserShortDetailsSchema;

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
}).extend({
  following: z.boolean(),
});

export type OtherUserDetails = z.infer<typeof OtherUserDetailsSchema>;

// Follower schemas

export const UserFollowerSchema = UserSchema.pick({
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
}).extend({
  recipesCount: z.number().int().nonnegative(),
  recipes: z.array(ShortRecipeDetailsSchema),
  following: z.boolean(),
});

export type UserFollower = z.infer<typeof UserFollowerSchema>;

export const UserFollowersSchema = z.array(UserFollowerSchema);

export type UserFollowers = z.infer<typeof UserFollowersSchema>;

export const PaginatedUserFollowersSchema = z.object({
  page: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  items: z.array(UserFollowerSchema),
});

export type PaginatedUserFollowers = z.infer<
  typeof PaginatedUserFollowersSchema
>;

// Following schemas
export const UserFollowingSchema = UserFollowerSchema;

export type UserFollowing = z.infer<typeof UserFollowingSchema>;

export const UserFollowingsSchema = z.array(UserFollowingSchema);

export type UserFollowings = z.infer<typeof UserFollowingsSchema>;

export const PaginatedUserFollowingsSchema = z.object({
  page: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  items: z.array(UserFollowingSchema),
});

export type PaginatedUserFollowings = z.infer<
  typeof PaginatedUserFollowingsSchema
>;
