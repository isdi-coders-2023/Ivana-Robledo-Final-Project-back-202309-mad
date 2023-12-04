import { Recipe } from './recipe';

export type LoginUser = {
  email: string;
  passwd: string;
};

export type User = LoginUser & {
  id: string;
  username: string;
  recipes: Recipe[];
};
