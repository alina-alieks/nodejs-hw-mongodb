import {
  getAllContacts,
  getContactById,
  addContact,
  upsertContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getAllContactsController = async (req, res) => {
  const { _id } = req.user;
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams({ ...req.query, userId: _id });

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

  const contact = await getContactById(contactId);

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
  const data = await addContact({ ...req.body, userId: _id });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;

  const data = await upsertContact(contactId, req.body);

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

  const data = await deleteContact(contactId);
  if (!data) {
    throw createHttpError(404, `Contact with id ${contactId} not found`);
  }

  res.status(204).send();
};
