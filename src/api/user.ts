import { faker } from '@faker-js/faker';
import { primaryKey } from '@mswjs/data';

export type User = {
  id: string;
  name: string;
};

export const userModel = {
  id: primaryKey(faker.string.nanoid),
  name: String,
};

export const createUserData = (): Partial<User> => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    name: `${firstName} ${lastName}`,
  };
};
