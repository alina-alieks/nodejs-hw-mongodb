import Contact from '../db/models/Contact.js';

export const getAllContacts = () => Contact.find();

export const getContactById = (id) => Contact.findById(id);

export const addContact = (data) => Contact.create(data);

export const updateContact = (filter, data, options = {}) =>
  Contact.findByIdAndUpdate(filter, data, { new: true, ...options });
