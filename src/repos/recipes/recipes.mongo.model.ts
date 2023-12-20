import { Schema, model } from 'mongoose';
import { Recipe } from '../../entities/recipe.js';

const recipesSchema = new Schema<Recipe>({
  recipeName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  img: {
    publicId: String,
    size: Number,
    width: Number,
    height: Number,
    format: String,
    url: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

recipesSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject._v;
    delete returnedObject.passwd;
  },
});

export const recipeModel = model<Recipe>('Recipe', recipesSchema, 'recipes');
