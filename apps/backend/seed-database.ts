import dotenv from 'dotenv';

import { getConfig } from './src/config';
import Database from './src/infrastructure/repositories/db';
import { syncDatabase } from './src/infrastructure/repositories/dbSync';
import { RecipePgDTO } from './src/infrastructure/repositories/pgSequelizeRecipeRepository';

dotenv.config({ path: 'apps/backend/.env.serve.development.local' });

async function seedDatabase(): Promise<void> {
  try {
    console.log('Seeding database...');

    const config = getConfig();

    Database.initialize(
      'postgres',
      config.db.host,
      config.db.port,
      config.db.name,
      config.db.username,
      config.db.password,
    );

    await syncDatabase();

    await RecipePgDTO.bulkCreate(recipesSeedData);

    console.log('Database seeding completed successfully.');

    await Database.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase().catch(console.error);

const recipesSeedData = [
  {
    name: 'Spaghetti Bolognese',
    description: 'Classic Italian pasta with a rich meat sauce.',
  },
  {
    name: 'Chicken Curry',
    description: 'Aromatic and flavorful Indian chicken curry.',
  },
  {
    name: 'Avocado Toast',
    description: 'Healthy toast with avocado, tomatoes, and seasonings.',
  },
];
