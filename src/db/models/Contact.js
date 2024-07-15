import { Schema, model } from 'mongoose';
import { tipeList } from '../../constants/contactConstants.js';
import { mongooseSaveError, setUpdateSettings } from './hooks.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: tipeList,
      default: 'personal',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

contactSchema.post('save', mongooseSaveError);
contactSchema.post('findOneAndUpdate', mongooseSaveError);
contactSchema.pre('findOneAndUpdate', setUpdateSettings);

const Contact = model('contact', contactSchema);
export default Contact;
