import { z } from 'zod';

export const IngredientSchema = z.object({
  id: z.string(),
  name: z.string(),
  measure: z.string(),
});

export type Ingredient = z.infer<typeof IngredientSchema>;

export const RecipeSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  category: z.string(),
  owner: z.string(),
  area: z.string(),
  instructions: z.string(),
  description: z.string(),
  thumb: z.string(),
  time: z.string(),
  ingredients: z.array(IngredientSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Recipe = z.infer<typeof RecipeSchema>;

export const RecipePublicSchema = RecipeSchema.omit({
  createdAt: true,
  updatedAt: true,
});

// TODO discuss zod schemas usage

/* export class Recipe {
  id: string;
  title: string;
  category: string;
  owner: string;
  area: string;
  instructions: string;
  description: string;
  thumb: string;
  time: string;
  ingredients: Ingredient[];
  createdAt: Date;
  updatedAt: Date;

  constructor(data: any) {
    this.id = data.id?.$oid || '';
    this.title = data.title || '';
    this.category = data.category || '';
    this.owner = data.owner?.$oid || '';
    this.area = data.area || '';
    this.instructions = data.instructions || '';
    this.description = data.description || '';
    this.thumb = data.thumb || '';
    this.time = data.time || '';
    this.ingredients = [];
    this.createdAt = new Date(
      parseInt(data.createdAt?.$date?.$numberLong || '0'),
    );
    this.updatedAt = new Date(
      parseInt(data.updatedAt?.$date?.$numberLong || '0'),
    );
  }
}

export class Ingredient {
  id: string;
  name: string;
  measure: string;

  constructor(id: string, name: string, measure: string) {
    this.id = id;
    this.name = name || '';
    this.measure = measure || '';
  }
} */
