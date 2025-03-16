import express from 'express';
import cors from 'cors';

import { getConfig } from './config';
import { testDatabaseConnection } from './db/sequelize';
import { syncDatabase } from './db/sync';

const config = getConfig();
const { frontendUrl, host, port } = config;

// if (!config.isTest) {
testDatabaseConnection().then(syncDatabase);
//}

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: frontendUrl ?? '*',
  })
);

app.get('/', (_req, res) => {
  res.status(200).send('Health check');
});

app.get('/api/data', (_req, res) => {
  res.status(200).json({ message: 'Hello from the backend!' });
});

app.post('/api/data', (req, res) => {
  res.status(200).json(req.body);
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
