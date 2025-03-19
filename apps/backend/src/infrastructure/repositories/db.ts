import type { Model, ModelCtor } from 'sequelize-typescript';
import { Sequelize } from 'sequelize-typescript';

class Database extends Sequelize {
  private static _instance: Database | null = null;

  private constructor(
    dialect: 'postgres' | 'mysql' | 'sqlite' | 'mariadb' | 'mssql',
    host: string,
    port: number,
    dbName: string,
    user: string,
    password: string,
  ) {
    super({
      database: dbName,
      username: user,
      password: password,
      dialect: dialect,
      host: host,
      port: port,
      logging: false,
      dialectOptions: {
        ssl: false,
      },
    });
  }

  public static initialize(
    dialect: 'postgres' | 'mysql' | 'sqlite' | 'mariadb' | 'mssql',
    host: string,
    port: number,
    dbName: string,
    user: string,
    password: string,
  ): void {
    if (!Database._instance) {
      Database._instance = new Database(
        dialect,
        host,
        port,
        dbName,
        user,
        password,
      );

      Database._instance.authenticate().then().catch(console.error);
    }
  }

  public static getInstance(): Database {
    if (!Database._instance) {
      throw new Error(
        'Database is not initialized. Call Database.initialize() first.',
      );
    }
    return Database._instance;
  }

  public static registerModels(models: ModelCtor<Model<any, any>>[]): void {
    const dbInstance = Database.getInstance();
    dbInstance.addModels(models);
  }

  public static async syncModels(): Promise<void> {
    const dbInstance = Database.getInstance();
    try {
      await dbInstance.sync();
      console.log('Database models synchronized successfully.');
    } catch (error) {
      console.error('Database synchronization failed:', error);
    }
  }

  public static async syncAndRegister(
    models: ModelCtor<Model<any, any>>[],
  ): Promise<void> {
    Database.registerModels(models);
    await Database.syncModels();
  }

  public static async disconnect(): Promise<void> {
    const dbInstance = Database.getInstance();
    try {
      await dbInstance.close();
      console.log('Database connection closed.');
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }
}

export default Database;
