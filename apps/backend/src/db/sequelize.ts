import { Sequelize } from 'sequelize';

import { getConfig } from '../config';

const config = getConfig();

const {
  name: dbName,
  username: dbUser,
  password: dbPassword,
  host: dbHost,
  port: dbPort,
  schema: dbSchema,
  ssl: dbSsl,
} = config.db;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  schema: dbSchema,
  dialectOptions: {
    ssl: dbSsl,
  },
  define: {
    // Set the schema for all models
    schema: dbSchema,
  },
});

export { sequelize };

export async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully');
  } catch (error) {
    console.error('Unable to connect to the database', error);
  }
}
