import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { getConfig } from '../config.js';
import {
  AreaDTO,
  CategoryDTO,
  IngredientDTO,
  initDbConnection,
  registerDbModels,
  shutdownDb,
  syncDb,
} from '../infrastructure/db/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFolderPath = path.resolve(__dirname, 'data');

async function seedDatabase(): Promise<void> {
  console.log('Configuring database...');

  try {
    const { db } = getConfig();

    await initDbConnection({
      dialect: 'postgres',
      host: db.host,
      port: db.port,
      database: db.name,
      username: db.username,
      password: db.password,
      schema: db.schema,
      dialectOptions: { ssl: db.ssl },
      define: { schema: db.schema },
      logging: false,
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return;
  }

  console.log('Database connected. Synchronizing...');

  try {
    registerDbModels();
    await syncDb();
  } catch (error) {
    console.error('Database synchronization error:', error);
    return;
  }

  console.log('Database synchronized. Seeding database...');

  await seedAreas();
  await seedCategories();
  await seedIngredients();

  console.log('Database seeded successfully. Shutting down...');

  try {
    await shutdownDb();
  } catch (error) {
    console.error('Error disconnecting from database:', error);
    return;
  }

  console.log('Job completed');
}

async function seedAreas(): Promise<void> {
  console.log('Seeding Areas...');
  try {
    const areasSeedData = await loadFromFile(
      path.resolve(dataFolderPath, 'areas.json'),
    );

    if (areasSeedData.length > 0) {
      await AreaDTO.bulkCreate(
        areasSeedData.map((area) => ({
          id: area._id.$oid,
          name: area.name,
        })),
      );
      console.log('Areas seeding completed successfully.');
    } else {
      console.log('No valid area data found to seed.');
    }
  } catch (error) {
    console.error('Error seeding areas:', error);
  }
}

async function seedCategories(): Promise<void> {
  console.log('Seeding Categories...');
  try {
    const categoriesSeedData = await loadFromFile(
      path.resolve(dataFolderPath, 'categories.json'),
    );

    if (categoriesSeedData.length > 0) {
      await CategoryDTO.bulkCreate(
        categoriesSeedData.map((category) => ({
          id: category._id.$oid,
          name: category.name,
        })),
      );
      console.log('Categories seeding completed successfully.');
    } else {
      console.log('No valid category data found to seed.');
    }
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
}

async function seedIngredients(): Promise<void> {
  console.log('Seeding Ingredients...');
  try {
    const ingredientsSeedData = await loadFromFile(
      path.resolve(dataFolderPath, 'ingredients.json'),
    );

    if (ingredientsSeedData.length > 0) {
      await IngredientDTO.bulkCreate(
        ingredientsSeedData.map((ingredient) => ({
          id: ingredient._id,
          name: ingredient.name,
          description: ingredient.desc,
          imageUrl: ingredient.img,
        })),
      );
      console.log('Ingredients seeding completed successfully.');
    } else {
      console.log('No valid ingredient data found to seed.');
    }
  } catch (error) {
    console.error('Error seeding ingredients:', error);
    process.exit(1);
  }
}

async function loadFromFile(filePath: string): Promise<any[]> {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading data from file ${filePath}:`, error);
    return [];
  }
}

export async function runSeedScript(): Promise<void> {
  try {
    await seedDatabase();
  } catch (error) {
    console.error('Error running seed script:', error);
  }
}
