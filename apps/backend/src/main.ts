import express from 'express';

import { testDatabaseConnection } from './db/sequelize';
import { syncDatabase } from './db/sync';
import { getConfig } from './config';

const config = getConfig();
const { host, port } = config;

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).send('Health check');
});

app.get('/api/data', (_req, res) => {
  res.status(200).json({ message: 'Hello from the backend!' });
});

app.post('/api/data', (req, res) => {
  res.status(200).json(req.body);
});

async function startServer() {
  await testDatabaseConnection();
  await syncDatabase();

  app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });
}

startServer();
