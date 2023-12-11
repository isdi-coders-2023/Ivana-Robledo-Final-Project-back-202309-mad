import { Recipe } from '../entities/recipe.js';
import { RecipesMongoRepo } from '../repos/recipes/recipes.mongo.repo.js';
import createDebug from 'debug';
import { Controller } from './controller.js';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error.js';

const debug = createDebug('W9E:recipe:controller');

export class RecipeController extends Controller<Recipe> {
  constructor(protected repo: RecipesMongoRepo) {
    super(repo);
    debug('Instantiated');
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file)
        throw new HttpError(406, 'Not Acceptable', 'Multer file is invalid');

      const imgData = await this.cloudinaryService.uploadImageToCloudinary(
        req.file.path
      );

      req.body.Img = imgData;
      super.create(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    if (req.file) {
      const imgData = await this.cloudinaryService.uploadImageToCloudinary(
        req.file.path
      );

      req.body.modelImg = imgData;
    }

    super.update(req, res, next);
  }
}
