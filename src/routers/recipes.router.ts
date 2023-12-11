import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { RecipesMongoRepo } from '../repos/recipes/recipes.mongo.repo.js';
import { RecipeController } from '../controllers/recipe.controller.js';
import { FileInterceptor } from '../middleware/fileInterceptor.js';

const debug = createDebug('W9E:recipes:router');
debug('Loaded');

const repo = new RecipesMongoRepo();
const recipeController = new RecipeController(repo);
const fileInterceptor = new FileInterceptor();

export const recipeRouter = createRouter();
recipeRouter.get('/', recipeController.getAll.bind(recipeController));
recipeRouter.get('/:id', recipeController.getById.bind(recipeController));
recipeRouter.post(
  '/create',
  fileInterceptor.singleFileStore('img').bind(fileInterceptor),
  recipeController.create.bind(recipeController)
);
recipeRouter.patch(
  '/update/:id',
  fileInterceptor.singleFileStore('img').bind(fileInterceptor),
  recipeController.update.bind(recipeController)
);
recipeRouter.delete(
  '/delete/:id',
  recipeController.delete.bind(recipeController)
);
