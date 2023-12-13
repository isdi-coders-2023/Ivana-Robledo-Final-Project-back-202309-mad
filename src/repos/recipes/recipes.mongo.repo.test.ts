/* Import { Recipe } from '../../entities/recipe'; */
import { UserModel } from '../users/users.mongo.model';
/* Import { UserMongoRepo } from '../users/users.mongo.repo'; */
import { recipeModel } from './recipes.mongo.model';
import { RecipesMongoRepo } from './recipes.mongo.repo';

jest.mock('../recipes/recipes.mongo.model');
jest.mock('../users/users.mongo.repo.js');
jest.mock('../users/users.mongo.model.js');
describe('Given the class RecipeMongoRepo', () => {
  let repo: RecipesMongoRepo;
  // Const exec = jest.fn().mockResolvedValue('Test');

  describe('When it is instantiated and its methods are called', () => {
    const exec = jest.fn().mockResolvedValue('Test');
    beforeEach(() => {
      repo = new RecipesMongoRepo();
      recipeModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });

      recipeModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      recipeModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      recipeModel.findByIdAndDelete = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });

      recipeModel.create = jest.fn().mockReturnValue({});
    });
    /* Test('Then it should execute getAll', async () => {
      const result = await repo.getAll();
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    }); */

    test('Then it should execute getById', async () => {
      const result = await repo.getById('');
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    /* Test('Then it should execute create', async () => {
      UserMongoRepo.prototype.getById = jest
        .fn()
        .mockResolvedValue({ recipes: [] });
      UserMongoRepo.prototype.update = jest.fn();
      const result = await repo.create({ author: {} } as Omit<Recipe, 'id'>);
      expect(result).toBe('Test');
    }); */

    test('Then it should execute update', async () => {
      const result = await repo.update('', { recipeName: 'cookies' });
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then should delete the recipe and remove it from the author list', async () => {
      const id = 'testId';
      const exec = jest.fn().mockResolvedValue({});
      recipeModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec,
      });

      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec,
      });
      await repo.delete(id);

      expect(recipeModel.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe('When we isntantiate it WITH errors', () => {
    const exec = jest.fn().mockResolvedValue(null);
    beforeEach(() => {
      recipeModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      recipeModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      recipeModel.findByIdAndDelete = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      repo = new RecipesMongoRepo();
    });

    test('Then getById should throw an error', async () => {
      expect(repo.getById('')).rejects.toThrow();
    });
    test('Then update should throw an error', async () => {
      expect(repo.update('', { recipeName: 'cookies' })).rejects.toThrow();
    });
    test('Then should throw an error if the recipe does not exist', async () => {
      const id = 'testId';
      recipeModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec,
      });

      await expect(repo.delete(id)).rejects.toThrow();
    });
  });
});
