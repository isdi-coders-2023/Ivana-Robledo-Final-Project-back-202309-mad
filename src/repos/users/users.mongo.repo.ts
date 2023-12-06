import createDebug from 'debug';
import { User } from '../../entities/user';
import { Repository } from '../repo';
import { UserModel } from './users.mongo.model';
import { Auth } from '../../services/auth';
import { HttpError } from '../../types/http.error';

const debug = createDebug('W9E:users:mongo:repo');
export class UserMongoRepo implements Repository<User> {
  constructor() {
    debug('Instanciated');
  }

  async getAll(): Promise<User[]> {
    const result = await UserModel.find().exec();
    return result;
  }

  async create(newItem: Omit<User, 'id'>): Promise<User> {
    newItem.passwd = await Auth.hash(newItem.passwd);
    const result: User = await UserModel.create(newItem);
    return result;
  }

  async login(loginUser: User): Promise<User> {
    const result = await UserModel.findOne({ email: loginUser.email });
    if (!result || !(await Auth.compare(loginUser.passwd, result.passwd)))
      throw new HttpError(401, 'Unauthorized');
    return result;
  }
}
