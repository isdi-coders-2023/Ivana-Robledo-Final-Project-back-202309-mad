/** @type {import('ts-jest').JestConfigWithTsJest} */

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist'],
  resolver: 'jest-ts-webcompat-resolver',
  coveragePathIgnorePatterns: [
    'src/controllers/controller.ts',
    'src/repos/users/users.mongo.model.ts',
    'src/repos/repo.ts',
    'src/app.ts',
    'src/index.ts',
    'src/routers/users.router.ts',
    'src/controllers/recipe.controller.ts',
    'src/repos/recipes/recipes.mongo.model.ts',
    'src/routers/recipes.router.ts',
    'src/routers/users.router.ts',
  ],
};
