import { Router } from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  addContactController,
  updateContactController,
} from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import isValidId from '../middlewares/isValidId.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getAllContactsController));

router.get(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);

router.post('/contacts', ctrlWrapper(addContactController));

router.patch(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(updateContactController),
);

export default router;
