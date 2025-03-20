import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import morgan from 'morgan';

import {
  categoriesRouter,
  ingredientsRouter,
  recipesRouter,
  usersRouter,
} from './domains/index.js';
import type HttpError from './helpers/HttpError.js';
import {
  initDbConnection,
  registerDbModels,
  shutdownDb,
} from './infrastructure/db/index.js';
import { getConfig } from './config.js';

const { port, host, db } = getConfig();

const app = express();

app.use(morgan('tiny'));
app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).send('Health check');
});
app.use('/api/users', usersRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/ingredients', ingredientsRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
  const { status = 500, message = 'Server error', errors } = err;
  res.status(status).json({ message, errors });
});

async function run() {
  // Start server
  const server = app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });

  // Handle shutdown
  const shutdown = async () => {
    console.log('Shutting down server...');
    await shutdownDb();

    server.close(async () => {
      console.log('Server closed');
      process.exit(0);
    });
  };

  // Initialize database
  initDbConnection({
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
  })
    .then(registerDbModels)
    .catch(shutdown);

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

run();
