import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/user';
import { Controller } from './controller.js';
import { UserMongoRepo } from '../repos/users/users.mongo.repo.js';
import createDebug from 'debug';
import { Auth } from '../services/auth.js';

const debug = createDebug('W9E:user:controller');

export class UserController extends Controller<User> {
  constructor(protected repo: UserMongoRepo) {
    super(repo);
    debug('Instantiated');
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.login(req.body);
      res.status(204);
      res.statusMessage = 'Accepted';
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
