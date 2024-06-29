import Contact from '../db/models/Contact.js';

export const getAllContacts = () => Contact.find();

export const getContactById = (id) => Contact.findById(id);

export const addContact = (data) => Contact.create(data);

export const upsertContact = async (id, data, options = {}) => {
  const result = await Contact.findByIdAndUpdate({ _id: id }, data, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  if (!result || !result.value) return null;

  return result;
};

export const deleteContact = (id) =>
  Contact.findByIdAndDelete({
    _id: id,
  });
