import { User } from '../../entities/user';
import { Auth } from '../../services/auth';
import { HttpError } from '../../types/http.error';
import { UserModel } from './users.mongo.model';
import { UserMongoRepo } from './users.mongo.repo';

jest.mock('./users.mongo.model');
jest.mock('../../services/auth');

describe('Given the class UsersMongoRepo', () => {
  let repo: UserMongoRepo;
  beforeEach(() => {
    repo = new UserMongoRepo();
  });

  describe('When it is instantiated', () => {
    test('Then, when we use the getAll() method', async () => {
      const mockExec = jest.fn().mockResolvedValueOnce([]);
      UserModel.find = jest.fn().mockReturnValueOnce({
        exec: mockExec,
      });
      const result = await repo.getAll();
      expect(mockExec).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
    test('Then, when we use the create() method', async () => {
      const mockUser = {
        username: 'Ivana',
        passwd: '1234',
        email: 'lalala@gmail.com',
        recipes: [],
      } as unknown as User;
      UserModel.create = jest.fn().mockReturnValueOnce(mockUser);
      const result = await repo.create(mockUser);
      expect(result).toEqual(mockUser);
    });
  });
  describe('When login() is called', () => {
    test('Then, it should throw HttpError with status 401 for invalid credentials', async () => {
      UserModel.findOne = jest.fn().mockResolvedValueOnce(null);
      const invalidLoginUser = {
        email: 'usuario@xxxxxxxx.com',
        passwd: 'contraseñaIncorrecta',
      };

      await expect(repo.login(invalidLoginUser)).rejects.toThrow(HttpError);
      await expect(repo.login(invalidLoginUser)).rejects.toHaveProperty(
        'status',
        401
      );
      await expect(repo.login(invalidLoginUser)).rejects.toHaveProperty(
        'statusMessage',
        'Unauthorized'
      );
    });

    test('Then, it should return the user for valid credentials', async () => {
      const mockUser = {
        email: 'usuario@dominio.com',
        passwd: 'contraseñaCorrecta',
      };

      UserModel.findOne = jest.fn().mockResolvedValueOnce(mockUser);

      Auth.compare = jest.fn().mockResolvedValueOnce(true);

      // Crea un objeto LoginUser simulado con credenciales válidas
      const validLoginUser = {
        email: 'usuario@dominio.com',
        passwd: 'contraseñaCorrecta',
      };

      // Llama a repo.login con credenciales válidas y espera que devuelva el usuario simulado
      const result = await repo.login(validLoginUser);
      expect(result).toEqual(mockUser);
    });
  });
});
