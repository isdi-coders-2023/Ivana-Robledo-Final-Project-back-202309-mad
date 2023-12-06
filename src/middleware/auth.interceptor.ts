import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error.js';
import { Auth } from '../services/auth.js';

const debug = createDebug('W9E:auth:interceptor');

export class AuthInterceptor {
  constructor() {
    debug('Instantiated');
  }

  authorization(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenHeader = req.get('Authorization');
      if (!tokenHeader?.startsWith('Bearer'))
        throw new HttpError(401, 'Unauthorized');
      const token = tokenHeader.split(' ')[1];
      const tokenPayload = Auth.verifyAndGetPayload(token);
      req.body.userId = tokenPayload.id;
      req.body.tokenRole = tokenPayload.role;
      next();
    } catch (error) {
      next(error);
    }
  }

  /* Async authentication(req: Request, res: Response, next: NextFunction) {
    try {
      const userID = req.body.id;
      const userToAddID = req.params.id;
      const repoUsers = new UserMongoRepo();
      const user = await repoUsers.getById(userToAddID);
      if (user.id !== userID)
        throw new HttpError(401, 'Unauthorized', 'User not valid');
      next();
    } catch (error) {
      next(error);
    }
  } */
}
