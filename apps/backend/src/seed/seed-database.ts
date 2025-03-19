import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { getConfig } from '../config.js';
import {
  initDbConnection,
  RecipeDTO,
  registerDbModels,
  shutdownDb,
  syncDb,
} from '../infrastructure/db/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFolderPath = path.resolve(__dirname, 'data');

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

export async function runSeedScript() {
  try {
    await seedDatabase();
  } catch (error) {
    console.error('Error running seed script:', error);
  }
}
