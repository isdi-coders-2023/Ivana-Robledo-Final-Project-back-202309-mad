import { AuthInterceptor } from './auth.interceptor.js';
import { HttpError } from '../types/http.error.js';
import { Auth } from '../services/auth';
import { NextFunction, Request, Response } from 'express';
import { RecipesMongoRepo } from '../repos/recipes/recipes.mongo.repo.js';

jest.mock('../services/auth.js');

describe('Given AuthInterceptor class', () => {
  let authInterceptor: AuthInterceptor;

  beforeEach(() => {
    authInterceptor = new AuthInterceptor();
  });

  describe('When we use authorization method', () => {
    test('Then should set userId and tokenRole on the request body when Authorization header is valid', async () => {
      const req = {
        get: jest.fn(() => 'Bearer validToken'),
        body: {},
      } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      const mockPayload = { id: 'userId' };
      (Auth.verifyAndGetPayload as jest.Mock).mockReturnValue(mockPayload);

      authInterceptor.authorization(req, res, next);

      expect(Auth.verifyAndGetPayload).toHaveBeenCalledWith('validToken');
      expect(mockPayload).toStrictEqual({ id: 'userId' });
      expect(next).toHaveBeenCalled();
    });
    test('Then should call next with an HttpError when Authorization header is missing or invalid', async () => {
      const req = {
        get: jest.fn().mockReturnValue(null),
        body: {},
      } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;
      authInterceptor.authorization(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(HttpError));
    });
  });

  jest.mock('../repos/recipes/recipes.mongo.repo.js', () => ({
    RecipesMongoRepo: jest.fn().mockImplementation(() => ({
      getById: jest.fn().mockResolvedValue({
        author: { id: 'userId' },
      }),
    })),
  }));

  describe('AuthInterceptor', () => {
    const res = {} as Response;
    const next = jest.fn() as NextFunction;
    const req = {
      body: { id: 'userId' },
      params: { id: 'recipeId' },
    } as unknown as Request;
    describe('authentication method', () => {
      test('should call next when the user is the author of the recipe', async () => {
        await authInterceptor.authentication(req, res, next);

        expect(next).toHaveBeenCalled();
      });
      test('Then should call next with an HttpError when the user is not the author of the recipe', async () => {
        const mockRecipe = { author: { id: 'otherUserId' } };
        const mockRecipesMongoRepoInstance = {
          getById: jest.fn().mockResolvedValue(mockRecipe),
        };

        jest
          .spyOn(RecipesMongoRepo.prototype, 'getById')
          .mockImplementation(mockRecipesMongoRepoInstance.getById);

        await authInterceptor.authentication(req, res, next);

        expect(mockRecipesMongoRepoInstance.getById).toHaveBeenCalledWith(
          'recipeId'
        );
        expect(next).toHaveBeenCalledWith(expect.any(HttpError));
      });

      test('Then should call next with an HttpError when there is an error fetching the recipe', async () => {
        const mockRecipesMongoRepoInstance = {
          getById: jest
            .fn()
            .mockRejectedValue(new HttpError(500, 'Database error')),
        };

        jest
          .spyOn(RecipesMongoRepo.prototype, 'getById')
          .mockImplementation(mockRecipesMongoRepoInstance.getById);

        await authInterceptor.authentication(req, res, next);

        expect(mockRecipesMongoRepoInstance.getById).toHaveBeenCalledWith(
          'recipeId'
        );
        expect(next).toHaveBeenCalledWith(expect.any(HttpError));
      });
    });
  });
});
