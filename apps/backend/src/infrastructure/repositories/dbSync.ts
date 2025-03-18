import Database from './db';
import { RecipePgDTO } from './pgSequelizeRecipeRepository';

export async function syncDatabase(): Promise<void> {
  try {
    await Database.syncAndRegister([RecipePgDTO]);
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
}
