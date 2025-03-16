import { Sequelize } from 'sequelize';

import { getConfig } from '../config';

// Get database config from the centralized config
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

let sequelize: Sequelize;
if (config.db.url) {
  // If a URL is provided, use it to create the Sequelize instance
  sequelize = new Sequelize(config.db.url, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: dbSsl,
    },
    define: {
      // Set the schema for all models
      schema: dbSchema,
    },
  });
} else {
  // Otherwise, use the individual parameters to create the Sequelize instance
  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
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
}

export { sequelize };

export async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully');
  } catch (error) {
    console.error('Unable to connect to the database', error);
  }
}
