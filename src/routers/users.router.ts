import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { UserMongoRepo } from '../repos/users/users.mongo.repo.js';
import { UserController } from '../controllers/user.controller.js';

const debug = createDebug('W9E:users:router');
debug('Loaded');

const repo = new UserMongoRepo();
const userController = new UserController(repo);

export const userRouter = createRouter();
userRouter.get('/', userController.getAll.bind(userController));
userRouter.get('/:id', userController.getById.bind(userController));
userRouter.post('/register', userController.create.bind(userController));
userRouter.post('/login', userController.login.bind(userController));
