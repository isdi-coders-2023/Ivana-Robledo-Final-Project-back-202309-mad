import { ImgData } from '../types/img.data';
import { User } from './user';

export type Recipe = {
  id: string;
  recipeName: string;
  description: string;
  ingredients: string;
  category: 'Galletas' | 'Tortas';
  img: ImgData;
  author: User;
};
