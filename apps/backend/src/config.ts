let cachedConfig: Config | null = null;

export interface Config {
  isProduction: boolean;
  isDevelopment: boolean;
  isTest: boolean;

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
  jwt: {
    secret: string;
    expiresIn: string;
  };
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
}

function loadConfig(): Config {
  if (cachedConfig) {
    return cachedConfig;
  }

  cachedConfig = {
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    isTest: process.env.NODE_ENV === 'test',

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

    jwt: {
      secret: process.env.JWT_SECRET as string,
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },

    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
      apiKey: process.env.CLOUDINARY_API_KEY as string,
      apiSecret: process.env.CLOUDINARY_API_SECRET as string,
    },
  };

  return cachedConfig;
}

export const getConfig = (): Config => loadConfig();
