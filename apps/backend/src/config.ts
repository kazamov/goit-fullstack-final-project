let cachedConfig: Config | null = null;

export interface Config {
  host: string;
  port: number;
  db: {
    name: string;
    username: string;
    password: string;
    host: string;
    port: number;
    schema: string;
    ssl: boolean;
  };
}

function loadConfig(): Config {
  if (cachedConfig) {
    return cachedConfig;
  }

  cachedConfig = {
    host: process.env.HOST || 'localhost',
    port: parseInt(process.env.PORT || '3000'),

    db: {
      name: process.env.DB_NAME as string,
      username: process.env.DB_USERNAME as string,
      password: process.env.DB_PASSWORD as string,
      host: process.env.DB_HOST as string,
      port: parseInt(process.env.DB_PORT || '5432'),
      schema: process.env.DB_SCHEMA || 'public',
      ssl: process.env.DB_ENABLE_SSL === 'true',
    },
  };

  return cachedConfig;
}

export const getConfig = (): Config => loadConfig();
