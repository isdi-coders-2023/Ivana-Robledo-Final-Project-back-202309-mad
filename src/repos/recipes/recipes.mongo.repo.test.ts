import { Recipe } from '../../entities/recipe';
import { recipeModel } from './recipes.mongo.model';
import { RecipesMongoRepo } from '../recipes/recipes.mongo.repo';

jest.mock('./recipes.mongo.model');

describe('Given the class RecipeMongoRepo', () => {
  let repo: RecipesMongoRepo;

  beforeEach(() => {
    repo = new RecipesMongoRepo();
  });

  describe('When it is instantiated and its methods are called', () => {
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

/* Import { RecipesMongoRepo } from '../recipes/recipes.mongo.repo';
import { HttpError } from '../../types/http.error';
import { recipeModel } from './recipes.mongo.model';
import { UserMongoRepo } from '../users/users.mongo.repo';
import { Recipe } from '../../entities/recipe';

jest.mock('./recipes.mongo.model');
jest.mock('../users/users.mongo.repo');

describe('RecipesMongoRepo', () => {
  let repo: RecipesMongoRepo;
  let userRepoMock: jest.Mocked<UserMongoRepo>;

  beforeEach(() => {
    userRepoMock = new UserMongoRepo() as jest.Mocked<UserMongoRepo>;
    repo = new RecipesMongoRepo();
    repo.userRepo = userRepoMock;
  });

  describe('getAll method', () => {
    it('should return all recipes', async () => {
      // Given
      const mockRecipes = [{ name: 'Recipe 1' }, { name: 'Recipe 2' }];
      (recipeModel.find as jest.Mock).mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockRecipes),
      });

      // When
      const result = await repo.getAll();

      // Then
      expect(result).toEqual(mockRecipes);
      expect(recipeModel.find).toHaveBeenCalled();
    });

    it('should throw HttpError when no recipes are found', async () => {
      // Given
      (recipeModel.find as jest.Mock).mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      // When
      const promise = repo.getAll();

      // Then
      await expect(promise).rejects.toThrow(HttpError);
      expect(recipeModel.find).toHaveBeenCalled();
    });
  });

  describe('getById method', () => {
    it('should return a recipe by ID', async () => {
      // Given
      const mockRecipe = { name: 'Mock Recipe', id: '123' };
      // Mock findById
      (recipeModel.findById as jest.Mock).mockReturnValueOnce({
        populate: jest.fn().mockResolvedValueOnce(mockRecipe), // Provide a mockRecipe
        exec: jest.fn(),
      });

      // Mock findByIdAndUpdate

      // When
      const result = await repo.getById('123');

      // Then
      expect(result).toEqual(mockRecipe);
      expect(recipeModel.findById).toHaveBeenCalledWith('123');
    });

    it('should throw HttpError when no recipe is found by ID', async () => {
      // Given
      (recipeModel.findById as jest.Mock).mockReturnValueOnce({
        populate: jest.fn().mockResolvedValueOnce(null),
        exec: jest.fn(),
      });

      // When
      const promise = repo.getById('123');

      // Then
      await expect(promise).rejects.toThrow(Error);
      expect(recipeModel.findById).toHaveBeenCalledWith('123');
    });
  });

  describe('update method', () => {
    it('should update a recipe by ID', async () => {
      // Given
      const mockUpdatedRecipe = { name: 'Updated Recipe', id: '123' };
      (recipeModel.findByIdAndUpdate as jest.Mock).mockReturnValueOnce({
        populate: jest.fn().mockResolvedValueOnce(mockUpdatedRecipe), // Provide a mockUpdatedRecipe
        exec: jest.fn(),
      });

      // When
      const result = await repo.update('123', {
        name: 'Updated Recipe',
      } as unknown as Partial<Recipe>);

      // Then
      expect(result).toEqual(mockUpdatedRecipe);
      expect(recipeModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { name: 'Updated Recipe' },
        { new: true }
      );
    });

    it('should throw HttpError when no recipe is found for update', async () => {
      // Given
      (recipeModel.findByIdAndUpdate as jest.Mock).mockReturnValueOnce({
        populate: jest.fn().mockResolvedValueOnce(null),
        exec: jest.fn(),
      });

      // When
      const promise = repo.update('123', {
        name: 'Updated Recipe',
      } as unknown as Partial<Recipe>);

      // Then
      await expect(promise).rejects.toThrow(Error);
      expect(recipeModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { name: 'Updated Recipe' },
        { new: true }
      );
    });
  });

  describe('delete method', () => {
    it('should delete a recipe by ID', async () => {
      // Given
      const mockDeletedRecipe = { name: 'Deleted Recipe', id: '123' };
      (recipeModel.findByIdAndDelete as jest.Mock).mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockDeletedRecipe),
      });

      // When
      await repo.delete('123');

      // Then
      expect(recipeModel.findByIdAndDelete).toHaveBeenCalledWith('123');
      expect(userRepoMock.update).toHaveBeenCalled(); // Assuming userRepoMock.update is called in your delete method
    });

    it('should throw HttpError when no recipe is found for deletion', async () => {
      // Given
      (recipeModel.findByIdAndDelete as jest.Mock).mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      // When
      const promise = repo.delete('123');

      // Then
      await expect(promise).rejects.toThrow(Error);
      expect(recipeModel.findByIdAndDelete).toHaveBeenCalledWith('123');
    });
  });
});
 */
