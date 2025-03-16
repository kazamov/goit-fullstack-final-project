// Store the cached config
let cachedConfig: Config | null = null;

// Define the Config type for better type safety
interface Config {
  /* env: string;
    isProduction: boolean;
    isTest: boolean;
    isDevelopment: boolean;
    isStaging: boolean; */
  host: string;
  frontendUrl: string;
  port: number;
  db: {
    url: string;
    name: string;
    username: string;
    password: string;
    host: string;
    port: number;
    schema: string;
    ssl: boolean;
  };
}

// Function to load config on demand
function loadConfig(): Config {
  // Return cached config if already loaded
  if (cachedConfig) {
    return cachedConfig;
  }

  // Create and cache the config object
  cachedConfig = {
    /* 
        env: localNodeEnv,
        isProduction: localNodeEnv === 'production',
        isTest: localNodeEnv === 'test',
        isDevelopment: localNodeEnv === 'development',
        isStaging: localNodeEnv === 'staging', */

    host: process.env.HOST || 'localhost',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    port: parseInt(process.env.PORT || '3000'),

    db: {
      url: process.env.DB_URL || '',
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
/* 

export const isProduction = (): boolean => getConfig().isProduction;
export const isTest = (): boolean => getConfig().isTest;
export const isDevelopment = (): boolean => getConfig().isDevelopment;
export const isStaging = (): boolean => getConfig().isStaging; */
