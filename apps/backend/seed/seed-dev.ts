import path from 'path';

import dotenv from 'dotenv';

import { runSeedScript } from './seed-database';

const envPath = path.resolve(__dirname, '../.env.serve.development.local');

dotenv.config({ path: envPath });

runSeedScript();
