import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import createDebug from 'debug';
import { errorMiddleware } from '../middleware/error.middleware.js';
import { userRouter } from '../routers/users.router.js';
import { recipeRouter } from '../routers/recipes.router.js';

const debug = createDebug('W9E:app');

export const app = express();
debug('Starting');

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.static('public'));

app.use('/users', userRouter);
app.use('/recipes', recipeRouter);

app.use(errorMiddleware);
