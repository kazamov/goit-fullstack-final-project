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

// Get schemas
export const GetUserResponseSchema = UserSchema.omit({
  password: true,
  createdAt: true,
  updatedAt: true,
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

// Update schemas
