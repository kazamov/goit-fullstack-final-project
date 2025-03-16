import { Contact } from './models/Contact';
import { User } from './models/User';

export async function syncDatabase() {
  try {
    // Sync all models
    await Promise.all([User.sync(), Contact.sync()]);
  } catch (error) {
    console.error('Unable to sync the database', error);
  }
}
