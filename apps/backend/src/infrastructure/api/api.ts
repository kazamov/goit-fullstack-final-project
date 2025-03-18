import type {
  Express,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import express from 'express';
import type { Server } from 'http';

import type RecipesService from '../../app/recipesServices';

class API {
  private recipesService: RecipesService;

  private e: Express;
  private server: Server | null = null;
  private host: string;
  private port: number;

  constructor(recipiesService: RecipesService, host: string, port: number) {
    this.recipesService = recipiesService;

    this.host = host;
    this.port = port;
    this.e = express();
    this.configureRoutes();
  }

  public run() {
    this.server = this.e.listen(this.port, this.host, () => {
      console.log(`[ ready ] http://${this.host}:${this.port}`);
    });
  }

  public shutdown() {
    if (this.server) {
      this.server.close(() => {
        console.log('[ shutdown ] Server closed');
      });
    }
  }

  private configureRoutes() {
    this.e.use(express.json());

    this.e.get('/', checkHealth);
    this.e.get('/api/data', this.getRecipesSampleData);
    this.e.post('/api/data', echo);
  }

  private getRecipesSampleData: RequestHandler = async (
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    try {
      const recipes = await this.recipesService.getAllRecipes();

      res.status(200).json({
        recipes: recipes,
      });
    } catch {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

export default API;

const checkHealth: RequestHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.status(200).send('Health check');
};

const echo: RequestHandler = (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.status(200).json(req.body);
};
