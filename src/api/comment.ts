import { faker } from '@faker-js/faker';
import { factory, manyOf, oneOf, primaryKey } from '@mswjs/data';
import { nanoid } from '@reduxjs/toolkit';

import { Post } from './post';

export type Comment = {
  id: string;
  createdAt: string;
  content: string;
  post: Post | Omit<Post, 'id'>;
};

export const commentModel = {
  id: primaryKey(nanoid),
  createdAt: String,
  content: String,
  post: oneOf('post'),
};

export type CreateCommentParams = {
  post: Post | Omit<Post, 'id'>;
};
export const createCommentData = ({
  post,
}: CreateCommentParams): Omit<Comment, 'id'> => {
  return {
    createdAt: faker.date.past().toISOString(),
    content: faker.lorem.paragraph(),
    post,
  };
};
