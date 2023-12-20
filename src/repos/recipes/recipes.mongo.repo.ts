import { Recipe } from '../../entities/recipe.js';
import createDebug from 'debug';
import { recipeModel } from './recipes.mongo.model.js';
import { HttpError } from '../../types/http.error.js';
import { UserMongoRepo } from '../users/users.mongo.repo.js';
import { Repository } from '../repo.js';
import { UserModel } from '../users/users.mongo.model.js';

const debug = createDebug('W9E:recipes:mongo:repo');

export class RecipesMongoRepo implements Repository<Recipe> {
  userRepo: UserMongoRepo;
  constructor() {
    this.userRepo = new UserMongoRepo();
    debug('Instantiated');
  }

  async getAll(): Promise<Recipe[]> {
    const result = await recipeModel.find().populate('author').exec();
    if (!result)
      throw new HttpError(404, 'Not Found', 'getAll method not possible');
    return result;
  }

  async getById(id: string): Promise<Recipe> {
    const result = await recipeModel
      .findById(id)
      .populate('author', {
        recipes: 0,
      })
      .exec();

    if (!result)
      throw new HttpError(404, 'Not Found', 'findById method not possible');
    return result;
  }

  async create(newItem: Omit<Recipe, 'id'>): Promise<Recipe> {
    const userID = newItem.author.id;
    if (!userID) {
      throw new HttpError(400, 'Bad Request', 'Author ID is missing');
    }

    const user = await this.userRepo.getById(userID);

    const result: Recipe = await recipeModel.create({
      ...newItem,
      author: userID,
    });

    user.recipes.push(result);
    await this.userRepo.update(userID, user);

    return result;
  }

  async update(id: string, updatedItem: Partial<Recipe>): Promise<Recipe> {
    const result = await recipeModel
      .findByIdAndUpdate(id, updatedItem, {
        new: true,
      })
      .populate('author', { Recipes: 0 })
      .exec();

    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
    return result;
  }

  async delete(id: string): Promise<void> {
    const result = (await recipeModel
      .findByIdAndDelete(id)
      .exec()) as unknown as Recipe;
    if (!result) {
      throw new HttpError(404, 'Not Found', 'Delete not possible');
    }

    await UserModel.findByIdAndUpdate(result.author, {
      $pull: { recipes: id },
    }).exec();
  }
}
