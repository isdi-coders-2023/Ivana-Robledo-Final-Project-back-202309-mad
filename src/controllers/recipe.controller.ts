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
      const result = await this.repo.create(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.author = req.body.userId;

      if (req.file) {
        const imgData = await this.cloudinaryService.uploadImage(req.file.path);
        req.body.img = imgData;
      }

      const result = await this.repo.update(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!this.repo) {
        throw new HttpError(400, 'Bad Request');
      }

      await this.repo.delete(req.params.id);
      // Res.json({});
      res.status(204);
      res.statusMessage = 'No Content';
      res.send('Deleted');
    } catch (error) {
      next(error);
    }
  }
}
