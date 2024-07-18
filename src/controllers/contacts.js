import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  addContact,
  upsertContact,
  deleteContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToPublicDir } from '../utils/saveFileToPublicDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

import { env } from '../utils/env.js';

export const getAllContactsController = async (req, res) => {
  const { _id } = req.user;
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = { ...parseFilterParams({ ...req.query }), userId: _id };

  const data = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts',
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const { _id } = req.user;

  const contact = await getContactById({ _id: contactId, userId: _id });

  if (!contact) {
    throw createHttpError(404, `Contact with id ${contactId} not found`);
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}`,
    data: contact,
  });
};

export const addContactController = async (req, res) => {
  const { _id } = req.user;
  console.log(req.file);
  let photo = null;

  if (req.file) {
    if (env('ENABLE_CLOUDINARY')) {
      photo = await saveFileToCloudinary(req.file);
    } else {
      photo = await saveFileToPublicDir(req.file);
    }
  }

  const data = await addContact({ ...req.body, userId: _id, photo });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id } = req.user;

  let photo = null;
  if (req.file) {
    if (env('ENABLE_CLOUDINARY')) {
      photo = await saveFileToCloudinary(req.file);
    } else {
      photo = await saveFileToPublicDir(req.file);
    }
  }

  const data = await upsertContact(
    {
      _id: contactId,
      userId: _id,
    },
    { ...req.body, photo },
  );

  if (!data) {
    throw createHttpError(404, `Contact with id ${contactId} not found`);
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: data.value,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id } = req.user;

  const data = await deleteContact({ _id: contactId, userId: _id });
  if (!data) {
    throw createHttpError(404, `Contact with id ${contactId} not found`);
  }

  res.status(204).send();
};
