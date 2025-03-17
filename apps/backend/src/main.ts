import express from 'express';

import { Recipe } from './db/models/Recipe';
import { testDatabaseConnection } from './db/sequelize';
import { recipePublicSchema } from './schemas/recipeSchema';
import { getConfig } from './config';

const config = getConfig();
const { host, port } = config;

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).send('Health check');
});

app.get('/api/data', async (_req, res) => {
  const recipes = await Recipe.findAll();

  res.status(200).json({
    recipes: recipes.map((recipe) => recipePublicSchema.parse(recipe.toJSON())),
  });
});

app.post('/api/data', (req, res) => {
  res.status(200).json(req.body);
});

async function startServer() {
  testDatabaseConnection();
  // syncDatabase();

  const server = app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
    });
  });
}

startServer();
