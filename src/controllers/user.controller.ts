import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { User, UserLoginData } from '../entities/user';
import { Repository } from '../repos/repo.js';
import { Auth } from '../services/auth.js';
/* Import { CloudinaryService } from '../services/media.files.js'; */
import { HttpError } from '../types/http.error';
import { Controller } from './controller.js';

const debug = createDebug('PF11:Controller: UserController');

export class UserController extends Controller<User> {
  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body as unknown as UserLoginData;
    const error = new HttpError(401, 'Unauthorized', 'Login Unauthorized');
    try {
      if (!this.repo.search) return;
      const data = await this.repo.search({ key: 'email', value: email });
      if (!data.length) {
        throw error;
      }

      const user = data[0];
      if (!(await Auth.compare(password, user.passwd))) {
        throw error;
      }
  } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.password = await Auth.hash(req.body.password);
      if (!req.file) {
        throw new HttpError(
          400,
          'Bad Request',
          'No avatar image for registration'
        );
      }
        } catch (error) {
      next(error);
    }

    super.create(req, res, next);
  }
  }}
