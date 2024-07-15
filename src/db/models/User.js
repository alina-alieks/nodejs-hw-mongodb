import { Schema, model } from 'mongoose';
import { emailRegexp } from '../../constants/userConstants.js';
import { mongooseSaveError, setUpdateSettings } from './hooks.js';

const userSchema = new Schema(
  {
    name: { type: String, requared: true },
    email: { type: String, unique: true, match: emailRegexp, requared: true },
    password: { type: String, requared: true },
  },
  { timestamps: true, versionKey: false },
);

userSchema.post('save', mongooseSaveError);
userSchema.post('findOneAndUpdate', mongooseSaveError);
userSchema.pre('findOneAndUpdate', setUpdateSettings);

const User = model('user', userSchema);

export default User;
