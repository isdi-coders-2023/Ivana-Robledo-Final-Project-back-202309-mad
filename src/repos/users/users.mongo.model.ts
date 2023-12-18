import { Schema, model } from 'mongoose';
import { User } from '../../entities/user.js';

const usersSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwd: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  recipes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'recipe',
    },
  ],
});

usersSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject._v;
    delete returnedObject.passwd;
  },
});

export const UserModel = model<User>('User', usersSchema, 'users');
