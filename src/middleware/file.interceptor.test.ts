import { FileInterceptor } from './file.interceptor';

jest.mock('crypto', () => ({
  randomUUID: jest.fn().mockReturnValue(''),
}));

describe('Given FileInterceptorClass', () => {
  const fileInterceptor = new FileInterceptor();

  test('it should return a middleware of type function ', () => {
    const result = fileInterceptor.singleFileStore();
    expect(typeof result).toBe('function');
  });
});
