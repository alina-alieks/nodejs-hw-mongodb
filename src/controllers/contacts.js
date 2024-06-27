import {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getAllContactsController = async (req, res) => {
  const data = await getAllContacts();
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
  const data = await addContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;

  const data = await updateContact(contactId, req.body);

  if (!data) {
    throw createHttpError(404, `Contact with id ${contactId} not found`);
  }

  res.status(200).json({
    status: 200,
    message: `Successfully update contact with id ${contactId}`,
    data,
  });
};
