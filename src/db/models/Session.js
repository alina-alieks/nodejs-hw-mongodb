import { Schema, model } from 'mongoose';
import { mongooseSaveError, setUpdateSettings } from './hooks.js';

const sessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false },
);

sessionSchema.post('save', mongooseSaveError);
sessionSchema.post('findOneAndUpdate', mongooseSaveError);
sessionSchema.pre('findOneAndUpdate', setUpdateSettings);

const Session = model('session', sessionSchema);

export default Session;
