import Contact from '../db/models/Contact.js';

export const getAllContacts = () => {
  const result = Contact.find();
  return result;
};

export const getContactByID = (id) => {
  const result = Contact.findById(id);
  return result;
};
