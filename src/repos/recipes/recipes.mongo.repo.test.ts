import { Recipe } from '../../entities/recipe';
import { recipeModel } from './recipes.mongo.model';
import { RecipesMongoRepo } from '../recipes/recipes.mongo.repo';

jest.mock('./recipes.mongo.model');
jest.mock('../users/users.mongo.model.js');

describe('Given the class RecipeMongoRepo', () => {
  let repo: RecipesMongoRepo;

  describe('When it is instantiated and its methods are called', () => {
    const exec = jest.fn().mockResolvedValue('Test');

    beforeEach(() => {
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

      test('Then, in getAll()', async () => {
        const mockExec = jest.fn().mockResolvedValueOnce([]);
        recipeModel.find = jest.fn().mockReturnValueOnce({
          populate: jest.fn().mockReturnValue({
            exec: mockExec,
          }),
        });
        const result = await repo.getAll();
        expect(mockExec).toHaveBeenCalled();
        expect(result).toEqual([]);
      });

      test('Then, in getById()', async () => {
        const execMock = jest.fn().mockResolvedValueOnce([]);
        (recipeModel.findById as jest.Mock).mockReturnValueOnce({
          populate: jest.fn().mockReturnValueOnce({
            exec: execMock,
          }),
        });
        const data = await repo.getById('id');
        expect(execMock).toHaveBeenCalled();
        expect(data).toEqual([]);
      });
      test('Then, when the method create() is called', async () => {
        const mockRecipe = {
          surface: '',
        } as unknown as Recipe;
        recipeModel.create = jest.fn().mockReturnValueOnce(mockRecipe);
        const newRecipe = await repo.create(mockRecipe);

        expect(newRecipe).toEqual(mockRecipe);
      });
      test('Then, when the method update() is called', async () => {
        const mockExec = jest.fn().mockResolvedValueOnce([]);
        (recipeModel.findByIdAndUpdate as jest.Mock).mockReturnValueOnce({
          populate: jest.fn().mockReturnValueOnce({
            exec: mockExec,
          }),
        });
        const updatedRecipe = await repo.update('', {});
        expect(mockExec).toHaveBeenCalled();
        expect(updatedRecipe).toEqual([]);
      });
      test('Then, when the method update() didnt found the user', () => {
        const execMock = jest.fn().mockResolvedValueOnce(null);
        recipeModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
          exec: execMock,
        });
        expect(repo.update('', {})).rejects.toThrow();
      });
      test('Then, when the method delete() is called', async () => {
        const mockExec = jest.fn().mockReturnValueOnce({});
        recipeModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
          exec: mockExec,
        });
        const result = await repo.delete('');
        expect(result).toBe(undefined);
      });
      test('Then, when the method delete didnt find an user', () => {
        const execMock = jest.fn().mockReturnValueOnce(null);
        recipeModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
          exec: execMock,
        });
        expect(repo.delete('')).rejects.toThrow();
      });
    });
  });
});
