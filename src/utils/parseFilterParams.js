import { tipeList } from '../constants/contactConstants.js';

const parseType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;
  const isType = tipeList.includes(type);

  if (isType) return type;
};

const parseBoolean = (value) => {
  const isString = typeof value === 'string';
  if (!isString) return;

  const parsedBoolean = value === 'true';

  return parsedBoolean;
};

export const parseFilterParams = (query) => {
  const { type, value } = query;
  const parsedType = parseType(type);
  const parsedBoolean = parseBoolean(value);

  return {
    type: parsedType,
    isFavourite: parsedBoolean,
  };
};
