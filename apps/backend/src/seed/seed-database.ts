import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import gravatar from 'gravatar';

import { getConfig } from '../config.js';
import { hashPassword } from '../helpers/password.js';
import {
  AreaDTO,
  CategoryDTO,
  IngredientDTO,
  initDbConnection,
  RecipeDTO,
  RecipeIngredientDTO,
  registerDbModels,
  shutdownDb,
  syncDb,
  TestimonialDTO,
  UserDTO,
  UserFavoriteRecipesDTO,
  UserFollowersDTO,
} from '../infrastructure/db/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFolderPath = path.resolve(__dirname, 'data');

async function seedDatabase(): Promise<void> {
  console.log('Configuring database...');

  try {
    const { db } = getConfig();

    await initDbConnection({
      dialect: 'postgres',
      host: db.host,
      port: db.port,
      database: db.name,
      username: db.username,
      password: db.password,
      schema: db.schema,
      dialectOptions: { ssl: db.ssl },
      define: { schema: db.schema },
      logging: false,
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return;
  }

  console.log('Database connected. Synchronizing...');

  try {
    registerDbModels();
    await syncDb();
  } catch (error) {
    console.error('Database synchronization error:', error);
    return;
  }

  console.log('Database synchronized. Seeding database...');

  await seedAreas();
  await seedCategories();
  await seedIngredients();
  await seedUsers();
  await seedTestimonials();
  await seedRecipes();

  console.log('Database seeded successfully. Shutting down...');

  try {
    await shutdownDb();
  } catch (error) {
    console.error('Error disconnecting from database:', error);
    return;
  }

  console.log('Job completed');
}

async function seedAreas(): Promise<void> {
  console.log('Seeding Areas...');
  try {
    const areasSeedData = await loadFromFile(
      path.resolve(dataFolderPath, 'areas.json'),
    );

    if (areasSeedData.length > 0) {
      await AreaDTO.bulkCreate(
        areasSeedData.map((area) => ({
          id: area._id.$oid,
          name: area.name,
        })),
      );
      console.log('Areas seeding completed successfully.');
    } else {
      console.log('No valid area data found to seed.');
    }
  } catch (error) {
    console.error('Error seeding areas:', error);
  }
}

async function seedCategories(): Promise<void> {
  console.log('Seeding Categories...');
  try {
    const categoriesSeedData = await loadFromFile(
      path.resolve(dataFolderPath, 'categories-with-images.json'),
    );

    if (categoriesSeedData.length > 0) {
      await CategoryDTO.bulkCreate(
        categoriesSeedData.map((category) => ({
          id: category._id.$oid,
          name: category.name,
          description: category.description,
          images: category.images,
        })),
      );
      console.log('Categories seeding completed successfully.');
    } else {
      console.log('No valid category data found to seed.');
    }
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
}

async function seedIngredients(): Promise<void> {
  console.log('Seeding Ingredients...');
  try {
    const ingredientsSeedData = await loadFromFile(
      path.resolve(dataFolderPath, 'ingredients.json'),
    );

    if (ingredientsSeedData.length > 0) {
      await IngredientDTO.bulkCreate(
        ingredientsSeedData.map((ingredient) => ({
          id: ingredient._id,
          name: ingredient.name,
          description: ingredient.desc,
          imageUrl: ingredient.img,
        })),
      );
      console.log('Ingredients seeding completed successfully.');
    } else {
      console.log('No valid ingredient data found to seed.');
    }
  } catch (error) {
    console.error('Error seeding ingredients:', error);
    process.exit(1);
  }
}

async function seedUsers(): Promise<void> {
  console.log('Seeding Users...');
  try {
    const usersSeedData = await loadFromFile(
      path.resolve(dataFolderPath, 'users2.json'),
    );

    if (usersSeedData.length > 0) {
      const password = await hashPassword('Qwerty123');
      await UserDTO.bulkCreate(
        usersSeedData.map((user) => ({
          id: user._id.$oid,
          name: user.name,
          email: user.email,
          avatarUrl:
            user.avatar ||
            gravatar.url(user.email, { s: '200', r: 'pg', d: 'retro' }),
          password,
        })),
      );

      for (const user of usersSeedData) {
        for (const followerId of user.followers || []) {
          await UserFollowersDTO.create({
            followerId,
            followingId: user._id.$oid,
          });
        }
      }

      console.log('Users seeding completed successfully.');
    } else {
      console.log('No valid user data found to seed.');
    }
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

async function seedTestimonials(): Promise<void> {
  console.log('Seeding Testimonials...');
  try {
    const testimonialsSeedData = await loadFromFile(
      path.resolve(dataFolderPath, 'testimonials2.json'),
    );

    if (testimonialsSeedData.length > 0) {
      await TestimonialDTO.bulkCreate(
        testimonialsSeedData.map((testimonial) => ({
          id: testimonial._id.$oid,
          userId: testimonial.owner.$oid,
          text: testimonial.testimonial,
          rating: 5, // Default rating since it's missing in JSON, adjust as needed
        })),
      );
      console.log('Testimonials seeding completed successfully.');
    } else {
      console.log('No valid testimonial data found to seed.');
    }
  } catch (error) {
    console.error('Error seeding testimonials:', error);
    process.exit(1);
  }
}

async function seedRecipes(): Promise<void> {
  console.log('Seeding Recipes...');
  try {
    const recipesSeedData = await loadFromFile(
      path.resolve(dataFolderPath, 'recipes.json'),
    );
    const usersSeedData = await loadFromFile(
      path.resolve(dataFolderPath, 'users2.json'),
    );

    if (recipesSeedData.length > 0 && usersSeedData.length > 0) {
      const userIds = usersSeedData.map((user) => user._id.$oid);
      const seededRecipeIds: string[] = [];

      for (const recipe of recipesSeedData) {
        const category = await CategoryDTO.findOne({
          where: { name: recipe.category },
        });
        if (!category) {
          console.warn(
            `Category '${recipe.category}' not found in the database. Skipping recipe '${recipe.title}'.`,
          );
          continue;
        }

        let areaId: string | null = null;
        if (recipe.area) {
          const area = await AreaDTO.findOne({ where: { name: recipe.area } });
          if (area) {
            areaId = area.id;
          } else {
            console.warn(
              `Area '${recipe.area}' not found in the database. Assigning null to recipe '${recipe.title}'.`,
            );
          }
        }

        const randomUserId =
          userIds[Math.floor(Math.random() * userIds.length)];

        await RecipeDTO.create({
          id: recipe._id.$oid,
          title: recipe.title,
          description: recipe.description,
          instructions: recipe.instructions,
          thumb: recipe.thumb,
          time: parseInt(recipe.time, 10) || 0,
          servings: recipe.servings || 1,
          difficulty: recipe.difficulty || 'medium',
          userId: randomUserId,
          categoryId: category.id,
          areaId: areaId,
        });

        for (const ingredient of recipe.ingredients || []) {
          await RecipeIngredientDTO.create({
            recipeId: recipe._id.$oid,
            ingredientId: ingredient.id,
            measure: ingredient.measure,
          });
        }

        seededRecipeIds.push(recipe._id.$oid);
      }

      // Adding favorite recipes
      console.log('Seeding favorite recipes...');
      for (const userId of userIds) {
        const numberOfFavorites = Math.floor(Math.random() * 6); // 0 to 5 favorites
        const shuffled = seededRecipeIds.sort(() => 0.5 - Math.random());
        const selectedFavorites = shuffled.slice(0, numberOfFavorites);

        for (const recipeId of selectedFavorites) {
          try {
            await UserFavoriteRecipesDTO.create({
              userId,
              recipeId,
            });
          } catch (e) {
            console.warn(
              `Could not add recipe '${recipeId}' to favorites of user '${userId}': ${e}`,
            );
          }
        }
      }

      console.log('Recipes and favorites seeding completed successfully.');
    } else {
      console.log('No valid recipe or user data found to seed.');
    }
  } catch (error) {
    console.error('Error seeding recipes:', error);
    process.exit(1);
  }
}

async function loadFromFile(filePath: string): Promise<any[]> {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading data from file ${filePath}:`, error);
    return [];
  }
}

export async function runSeedScript(): Promise<void> {
  try {
    await seedDatabase();
  } catch (error) {
    console.error('Error running seed script:', error);
  }
}
