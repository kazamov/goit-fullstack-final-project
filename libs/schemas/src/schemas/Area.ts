import { z } from 'zod';

export const AreaSchema = z.object({
  id: z.string(),
  name: z.string(),
  recipes: z.array(z.number().int()),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Area = z.infer<typeof AreaSchema>;

export const GetAreaResponseSchema = z.array(
  AreaSchema.pick({
    id: true,
    name: true,
  }),
);

export type GetAreaResponse = z.infer<typeof GetAreaResponseSchema>;
