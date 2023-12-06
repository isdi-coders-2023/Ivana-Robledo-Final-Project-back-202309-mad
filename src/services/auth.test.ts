import { Auth } from './auth.js';
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('bcrypt');

describe('Given Auth abstract class', () => {
  describe('When using its methods', () => {
    test('Then hash should...', () => {
      // Arrange
      (hash as jest.Mock).mockReturnValue('test');
      const mockValue = '';

      // Act
      const result = Auth.hash(mockValue);

      // Assert
      expect(hash).toHaveBeenCalled();
      expect(result).toBe('test');
    });

    test('Then comparison should...', () => {
      // Arrange
      (compare as jest.Mock).mockReturnValue(true);
      const mockValue = '';

      // Act
      const result = Auth.compare(mockValue, mockValue);

      // Assert
      expect(compare).toHaveBeenCalled();
      expect(result).toBe(true);
    });
    test('When the signJWT is called', () => {
      jwt.sign = jest.fn();
      const payload = { id: '', email: '' };
      Auth.signJWT(payload);
      expect(jwt.sign).toHaveBeenCalled();
    });
    test('When verifyAndGetPayload is called', () => {
      jwt.verify = jest.fn();
      Auth.verifyAndGetPayload('');
      expect(jwt.verify).toHaveBeenCalled();
    });
    test('When verifyAndGetPayload is called and throws and Error', () => {
      jwt.verify = jest.fn().mockReturnValue('');
      expect(() => Auth.verifyAndGetPayload(''));
    });
  });
  describe('When we use its methods with errors', () => {
    test('Then verifyAndGetPayload should...', () => {
      jwt.verify = jest.fn().mockReturnValue('');
      expect(() => Auth.verifyAndGetPayload('')).toThrow();
      expect(jwt.verify).toHaveBeenCalled();
    });
  });
});
