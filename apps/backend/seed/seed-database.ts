import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';

import { getConfig } from '../src/config';
import {
  initDbConnection,
  RecipeDTO,
  registerDbModels,
  shutdownDb,
  syncDb,
} from '../src/infrastructure/db';

const envPath = path.resolve(__dirname, '../.env.serve.development.local');
const dataFolderPath = path.resolve(__dirname, 'data');

dotenv.config({ path: envPath });

async function seedDatabase(): Promise<void> {
  try {
    console.log('Seeding database...');

    const { db } = getConfig();

    await initDbConnection({
      dialect: 'postgres',
      host: db.host,
      port: db.port,
      database: db.name,
      username: db.username,
      password: db.password,
      schema: db.schema,
      dialectOptions: {
        ssl: db.ssl,
      },
      define: {
        schema: db.schema,
      },
      logging: false,
    });

    registerDbModels();

    await syncDb();

    const recipesSeedData = await loadRecipesFromFile(
      path.resolve(dataFolderPath, 'recipes.json'),
    );

    if (recipesSeedData.length > 0) {
      await RecipeDTO.bulkCreate(
        recipesSeedData.map((recipe) => recipe.toJSON()),
      );
      console.log('Database seeding completed successfully.');
    } else {
      console.log('No valid recipe data found to seed.');
    }

    await shutdownDb();
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase().catch(console.error);

async function loadRecipesFromFile(filePath: string): Promise<RecipeDTO[]> {
  try {
    const data: string = fs.readFileSync(path.resolve(filePath), 'utf-8');
    const recipes: any[] = JSON.parse(data);

    return recipes.map((recipe: any) =>
      RecipeDTO.build({
        title: recipe.title,
        category: recipe.category,
        owner: recipe.owner['$oid'],
        area: recipe.area,
        instructions: recipe.instructions,
        description: recipe.description,
        thumb: recipe.thumb,
        time: recipe.time,
      }),
    );
  } catch (error) {
    console.error('Error loading recipes from file:', error);
    return [];
  }
}
