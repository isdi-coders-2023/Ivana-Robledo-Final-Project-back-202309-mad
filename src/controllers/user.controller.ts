import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/user';
import { Controller } from './controller.js';
import { UserMongoRepo } from '../repos/users/users.mongo.repo.js';
import createDebug from 'debug';
import { LoginResponse } from '../types/login.response.js';
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
      const data: LoginResponse = {
        user: result,
        token: Auth.signJWT({ id: result.id, email: result.email }),
      };

      res.status(200);
      res.statusMessage = 'Ok';
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
