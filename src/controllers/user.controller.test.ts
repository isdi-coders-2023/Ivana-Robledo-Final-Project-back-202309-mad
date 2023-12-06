import { Request, Response } from 'express';
import { UserMongoRepo } from '../repos/users/users.mongo.repo';
import { Auth } from '../services/auth';
import { UserController } from './user.controller';

describe('Given the class UserController', () => {
  describe('When it is instantiated', () => {
    const mockRepo: UserMongoRepo = {
      getAll: jest.fn(),
      login: jest.fn(),
      create: jest.fn(),
    };

    const userController = new UserController(mockRepo);

    test('Then when we use login()', async () => {
      const mockUser = {
        email: '',
        passwd: '',
      };
      const mockRequest = {
        params: { id: '1' },
        body: mockUser,
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      const mockNext = jest.fn();

      Auth.compare = jest.fn().mockReturnValueOnce(true);

      await userController.login(mockRequest, mockResponse, mockNext);
    });
    test('Then, when login() throws an error when compare fails', async () => {
      const mockUser = {
        email: '',
        passwd: '',
      };
      const mockRequest = {
        params: { id: '1' },
        body: mockUser,
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();

      Auth.compare = jest.fn().mockResolvedValueOnce(false);

      await userController.login(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
    test('Then, when we use getAll()', async () => {
      const mockRequest = {} as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();
      await userController.getAll(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    test('Then, when we use create()', async () => {
      const mockUser = {
        email: '',
        passwd: '',
        username: '',
      };

      Auth.hash = jest.fn();
      (mockRepo.create as jest.Mock).mockReturnValueOnce(mockUser);

      const mockRequest = {
        params: '1',
        body: {
          passwd: '12345',
        },
      } as unknown as Request;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn(),
      } as unknown as Response;

      const mockNext = jest.fn();
      await userController.create(mockRequest, mockResponse, mockNext);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });
  });
  describe('When it is instantitated with errors', () => {
    const mockRepo: UserMongoRepo = {
      getAll: jest.fn().mockRejectedValueOnce(new Error('GetAll Error')),
      create: jest.fn().mockRejectedValueOnce(new Error('Create Error')),
    } as unknown as UserMongoRepo;
    const userController = new UserController(mockRepo);
    test('Then, when getAll throws an error', async () => {
      const mockRequest = {} as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();
      await userController.getAll(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new Error('GetAll Error'));
    });

    test('Then, when create() throws an error', async () => {
      const mockRequest = {
        body: {
          email: '',
          passwd: '',
          userame: '',
        },
      } as unknown as Request;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn(),
      } as unknown as Response;

      const mockNext = jest.fn();
      await userController.create(mockRequest, mockResponse, mockNext);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(new Error('Create Error'));
    });
  });
});
