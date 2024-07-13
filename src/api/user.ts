import { faker } from '@faker-js/faker';
import { factory, manyOf, oneOf, primaryKey } from '@mswjs/data';
import { nanoid } from '@reduxjs/toolkit';

import { Post } from './post';

export type User = {
  id: string;
  name: string;
};

export const userModel = {
  id: primaryKey(nanoid),
  name: String,
};

export const createUserData = (): Partial<User> => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    name: `${firstName} ${lastName}`,
  };
};
