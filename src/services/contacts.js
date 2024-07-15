import Contact from '../db/models/Contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = Contact.find();

  if (filter.userId) {
    contactsQuery.where('userId').equals(filter.userId);
  }

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }

  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    Contact.find().merge(contactsQuery).countDocuments(),

    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = (id) => Contact.findById(id);

export const addContact = (data) => Contact.create(data);

export const upsertContact = async (id, data, options = {}) => {
  const result = await Contact.findByIdAndUpdate({ _id: id }, data, {
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
