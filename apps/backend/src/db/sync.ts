import { Recipe } from './models/Recipe';
import { User } from './models/User';

export async function syncDatabase() {
  try {
    // Sync all models
    await Promise.all([User.sync(), Recipe.sync()]);

    console.log('Database synced successfully');
  } catch (error) {
    console.error('Unable to sync the database', error);
  }
}
