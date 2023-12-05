import debug from 'debug';
import { LoginUser, User } from '../../entities/user';
import { Repository } from '../repo';
import { UserModel } from './users.mongo.model';
import { Auth } from '../../services/auth';
import { HttpError } from '../../types/http.error';

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

  async login(loginUser: LoginUser): Promise<User> {
    const result = await UserModel.findOne({
      email: loginUser.email,
    }); /* .exec() */
    if (!result || !(await Auth.compare(loginUser.passwd, result.passwd)))
      throw new HttpError(401, 'Unauthorized');
    return result;
  }
}
