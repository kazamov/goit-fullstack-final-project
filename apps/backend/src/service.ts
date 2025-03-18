import RecipesService from './app/recipesServices';
import API from './infrastructure/api/api';
import Database from './infrastructure/repositories/db';
import { syncDatabase } from './infrastructure/repositories/dbSync';
import { PgSequelizeRecipeRepository } from './infrastructure/repositories/pgSequelizeRecipeRepository';
import type { Config } from './config';
import { getConfig } from './config';

class Service {
  private config: Config;
  private API: API;

  constructor() {
    this.config = getConfig();

    const recipesRepo = new PgSequelizeRecipeRepository();

    const recipesSvc = new RecipesService(recipesRepo);

    this.API = new API(recipesSvc, this.config.host, this.config.port);
  }

  public run() {
    Database.initialize(
      'postgres',
      this.config.db.host,
      this.config.db.port,
      this.config.db.name,
      this.config.db.username,
      this.config.db.password,
    );
    syncDatabase().catch(console.error);

    this.API.run();
  }

  public shutdown() {
    Database.disconnect().catch(console.error);

    this.API.shutdown();
  }
}

export default Service;
