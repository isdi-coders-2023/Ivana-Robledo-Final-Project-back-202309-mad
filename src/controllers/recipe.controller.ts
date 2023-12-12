import { Recipe } from '../entities/recipe.js';
import { RecipesMongoRepo } from '../repos/recipes/recipes.mongo.repo.js';
import createDebug from 'debug';
import { Controller } from './controller.js';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error.js';
import { MediaFiles } from '../services/media.files.js';

const debug = createDebug('W9E:recipe:controller');

export class RecipeController extends Controller<Recipe> {
  declare cloudinaryService: MediaFiles;
  constructor(protected repo: RecipesMongoRepo) {
    super(repo);
    this.cloudinaryService = new MediaFiles();
    debug('Instantiated');
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.author = { id: req.body.userId };
      if (!req.file)
        throw new HttpError(406, 'Not Acceptable', ' Invalid multer file');
      const imgData = await this.cloudinaryService.uploadImage(req.file.path);
      req.body.img = imgData;
      super.create(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, _next: NextFunction) {
    req.body.author = req.body.userId;
    if (req.file) {
      const imgData = await this.cloudinaryService.uploadImage(req.file.path);

      req.body.modelImg = imgData;
    }

    const result = this.repo.update(req.params.id, req.body);
    res.send(result);
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new HttpError(400, 'Bad Request', 'ID is missing');
      }

      await this.repo.delete(id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}
