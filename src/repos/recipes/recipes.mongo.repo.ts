import { Recipe } from '../../entities/recipe.js';
import { Repository } from '../repo.js';
import createDebug from 'debug';
import { recipeModel } from './recipes.mongo.model.js';
import { HttpError } from '../../types/http.error.js';

const debug = createDebug('AB:recipes:mongo:repo');

export class RecipesMongoRepo implements Repository<Recipe> {
  constructor() {
    debug('Instantiated');
  }

  async getAll(): Promise<Recipe[]> {
    const result = await recipeModel.find().exec();
    if (!result)
      throw new HttpError(404, 'Not Found', 'getAll method not possible');
    return result;
  }

  async getById(id: string): Promise<Recipe> {
    const result = await recipeModel.findById(id).exec();
    if (!result)
      throw new HttpError(404, 'Not Found', 'findById method not possible');
    return result;
  }

  async create(newItem: Omit<Recipe, 'id'>): Promise<Recipe> {
    const result = await recipeModel.create(newItem);
    if (!result)
      throw new HttpError(404, 'Not Found', 'create method not possible');
    return result;
  }

  async update(id: string, updatedItem: Partial<Recipe>): Promise<Recipe> {
    if (id === updatedItem.id) throw new HttpError(406, 'Not Acceptable');
    const result = await recipeModel
      .findByIdAndUpdate(id, updatedItem, {
        new: true,
      })
      .exec();

    if (!result)
      throw new HttpError(406, 'Not Found', 'Update was not possible');

    return result;
  }

  async delete(id: string): Promise<void> {
    const result = await recipeModel.findByIdAndDelete(id).exec();

    if (!result)
      throw new HttpError(406, 'Not Found', 'Delete was not possible');
  }
}
