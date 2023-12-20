import createDebug from 'debug';
import { LoginUser, User } from '../../entities/user';
import { Repository } from '../repo';
import { UserModel } from './users.mongo.model.js';
import { Auth } from '../../services/auth.js';
import { HttpError } from '../../types/http.error.js';

const debug = createDebug('W9E:users:mongo:repo');
export class UserMongoRepo implements Repository<User> {
  constructor() {
    debug('Instanciated');
  }

  async getAll(): Promise<User[]> {
    const result = await UserModel.find().populate('recipes').exec();
    return result;
  }

  async getById(id: string): Promise<User> {
    const result = await UserModel.findById(id).exec();
    if (!result) throw new HttpError(404, 'Not Found', 'GetById not possible');
    return result;
  }

  async create(newItem: Omit<User, 'id'>): Promise<User> {
    newItem.passwd = await Auth.hash(newItem.passwd);
    const result: User = await UserModel.create(newItem);
    return result;
  }

  async update(id: string, updatedItem: Partial<User>): Promise<User> {
    const result = await UserModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
    })
      .populate('recipes')
      .exec();
    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
    return result;
  }

  async login(loginUser: LoginUser): Promise<User> {
    const result = await UserModel.findOne({ email: loginUser.email })
      .populate('recipes')
      .exec();
    if (!result || !(await Auth.compare(loginUser.passwd, result.passwd)))
      throw new HttpError(401, 'Unauthorized');
    return result;
  }
}
