import { UserMongoRepo } from './users.mongo.repo';
import { UserModel } from './users.mongo.model.js';
import { LoginUser, User } from '../../entities/user';
import { Auth } from '../../services/auth.js';

jest.mock('./users.mongo.model.js');
jest.mock('../../services/auth.js');

describe('Given UsersMongoRepo', () => {
  Auth.hash = jest.fn();
  Auth.compare = jest.fn().mockResolvedValue(true);
  let repo: UserMongoRepo;

  describe('When we instantiate it without errors', () => {
    const exec = jest.fn().mockResolvedValue('Test');

    beforeEach(() => {
      const mockQueryMethod = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
        exec,
      });

      UserModel.find = mockQueryMethod;
      UserModel.findById = mockQueryMethod;
      UserModel.findOne = mockQueryMethod;
      UserModel.findByIdAndUpdate = mockQueryMethod;
      UserModel.create = jest.fn().mockResolvedValue('Test');
      repo = new UserMongoRepo();
    });

    test('Then it should execute getAll', async () => {
      const result = await repo.getAll();
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then, when data isnt found with the getById() method', () => {
      const mockExec = jest.fn().mockResolvedValueOnce(null);
      UserModel.findById = jest.fn().mockReturnValueOnce({
        exec: mockExec,
      });
      expect(repo.getById('')).rejects.toThrow();
    });

    test('Then it should execute create', async () => {
      const result = await repo.create({} as Omit<User, 'id'>);
      expect(Auth.hash).toHaveBeenCalled();
      expect(UserModel.create).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute login', async () => {
      const result = await repo.login({ email: '' } as LoginUser);
      expect(UserModel.findOne).toHaveBeenCalled();
      expect(result).toBe('Test');
    });
  });

  test('Then it should execute update', async () => {
    const exec = jest.fn().mockResolvedValue('Test'); // Mock the resolved value to 'Test'
    repo.update = exec;
    const result = await repo.update('1', { id: '2' });
    expect(exec).toHaveBeenCalled();
    expect(result).toBe('Test');
  });

  describe('When we instantiate it WITH errors', () => {
    const exec = jest.fn().mockResolvedValue(null);
    beforeEach(() => {
      UserModel.findById = jest.fn().mockReturnValue({
        exec,
      });
      UserModel.findOne = jest.fn().mockReturnValue({
        exec,
      });
      repo = new UserMongoRepo();
    });
    test('Then login should throw an error', async () => {
      expect(repo.login({} as User)).rejects.toThrow();
    });
  });
});
