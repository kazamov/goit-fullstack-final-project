import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import morgan from 'morgan';

import type HttpError from './helpers/HttpError';
import {
  initDbConnection,
  registerDbModels,
  shutdownDb,
} from './infrastructure/db';
import { getConfig } from './config';
import { recipesRouter, usersRouter } from './domains';

const { port, host, db } = getConfig();

const app = express();

app.use(morgan('tiny'));
app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).send('Health check');
});
app.use('/api/users', usersRouter);
app.use('/api/recipes', recipesRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
  const { status = 500, message = 'Server error', errors } = err;
  res.status(status).json({ message, errors });
});

async function run() {
  // Initialize database
  await initDbConnection({
    dialect: 'postgres',
    host: db.host,
    port: db.port,
    database: db.name,
    username: db.username,
    password: db.password,
    schema: db.schema,
    dialectOptions: {
      ssl: db.ssl,
    },
    define: {
      schema: db.schema,
    },
    logging: false,
  });
  registerDbModels();

  // Start server
  const server = app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });

  // Handle shutdown
  const shutdown = async () => {
    await shutdownDb();

    server.close(async () => {
      console.log('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

run();
