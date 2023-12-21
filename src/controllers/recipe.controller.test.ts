import { NextFunction, Request, Response } from 'express';
import { RecipeController } from './recipe.controller';
import { RecipesMongoRepo } from '../repos/recipes/recipes.mongo.repo';

describe('Given RecipesController Class...', () => {
  let controller: RecipeController;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;
  let mockRepo: jest.Mocked<RecipesMongoRepo>;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: { id: 'test' },
    } as unknown as Request;

    mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
    } as unknown as Response;
    mockNext = jest.fn();
    mockRepo = {
      create: jest.fn().mockResolvedValue({}),
      getById: jest.fn().mockResolvedValue({}),
      getAll: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
    } as unknown as jest.Mocked<RecipesMongoRepo>;
    controller = new RecipeController(mockRepo);
  });

  describe('When we create a new recipe without errors', () => {
    test('Then the create method should create a new recipe with its info and the right image...', async () => {
      const mockRequest = {
        file: {
          path: 'valid/path/to/image.jpg',
        },
        body: {},
        params: { id: 'test' },
      } as unknown as Request;

      const mockRepo = {
        create: jest.fn(),
        delete: jest.fn(),
      } as unknown as RecipesMongoRepo;
      const controller = new RecipeController(mockRepo);
      const mockImageData = 'Test';
      const mockCloudinaryService = {
        uploadImage: jest.fn().mockResolvedValue(mockImageData),
      };

      controller.cloudinaryService = mockCloudinaryService;

      await controller.create(mockRequest, mockResponse, mockNext);

      expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(
        mockRequest.file?.path
      );
      expect(mockRequest.body.img).toBe(mockImageData);
    });

    test('Then update should...', async () => {
      await controller.update(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });

    test('Then delete should...', async () => {
      await controller.delete(mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.statusMessage).toBe('No Content');
    });
  });

  describe('When we instantiate it with errors', () => {
    let mockError: Error;
    beforeEach(() => {
      mockError = new Error('Bad request');
      const mockRepo = {
        create: jest.fn().mockRejectedValue(mockError),
        update: jest.fn().mockRejectedValue(mockError),
        delete: jest.fn().mockRejectedValue(mockError),
      } as unknown as RecipesMongoRepo;
      controller = new RecipeController(mockRepo);
    });

    test('Then create should throw an error', async () => {
      await controller.create(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    test('Then update should throw an error', async () => {
      await controller.update(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    test('Then delete should ...', async () => {
      await controller.delete(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
