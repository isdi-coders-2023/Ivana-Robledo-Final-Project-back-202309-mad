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
      const result = req.body.userId
        ? await this.repo.getById(req.body.userId)
        : await this.repo.login(req.body);
      const data = {
        user: result,
        token: Auth.signJWT({
          id: result.id,
          email: result.email,
        }),
      };
      debug('login controller', data);
      res.status(202);
      res.statusMessage = 'Accepted';
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
