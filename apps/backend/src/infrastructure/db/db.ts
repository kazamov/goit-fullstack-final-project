import type { SequelizeOptions } from 'sequelize-typescript';
import { Sequelize } from 'sequelize-typescript';

import {
  AreaDTO,
  CategoryDTO,
  IngredientDTO,
  RecipeDTO,
  RecipeIngredientDTO,
  RecipeRatingDTO,
  TestimonialDTO,
  UserDTO,
  UserFavoriteRecipesDTO,
  UserFollowersDTO,
} from './models/index.js';

let sequelize: Sequelize | null = null;

export async function initDbConnection(options: SequelizeOptions) {
  if (!sequelize) {
    sequelize = new Sequelize(options);
  }

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

export function registerDbModels() {
  if (!sequelize) {
    throw new Error('Sequelize instance is not initialized.');
  }

  sequelize.addModels([
    RecipeDTO,
    AreaDTO,
    CategoryDTO,
    IngredientDTO,
    RecipeIngredientDTO,
    RecipeRatingDTO,
    TestimonialDTO,
    UserDTO,
    UserFollowersDTO,
    UserFavoriteRecipesDTO,
  ]);
}

export async function syncDb() {
  if (!sequelize) {
    throw new Error('Sequelize instance is not initialized.');
  }

  try {
    await sequelize.sync();
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Database synchronization failed:', error);
    throw error;
  }
}

export async function shutdownDb() {
  if (sequelize) {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}
