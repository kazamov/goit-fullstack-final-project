import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';

// import { runSeedCategoryImagesScript } from './seed-category-pictures.js';
import { runSeedScript } from './seed-database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../../.env.serve.development.local');

dotenv.config({ path: envPath });

// await runSeedCategoryImagesScript();
await runSeedScript();
