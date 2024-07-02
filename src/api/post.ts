import { faker } from '@faker-js/faker';
import { factory, manyOf, oneOf, primaryKey } from '@mswjs/data';
import { nanoid } from '@reduxjs/toolkit';

import { Comment } from './comment';
import { User } from './user';
import { Vote } from './vote';

export type Post = {
  id: string;
  title: string;
  createdAt: string;
  content: string;
  author: User;
};

export const postModel = {
  id: primaryKey(nanoid),
  title: String,
  createdAt: String,
  content: String,
  author: oneOf('user'),
};

export type CreatePostParams = {
  author: User;
};

export const createPostData = ({
  author,
}: CreatePostParams): Omit<Post, 'id'> => {
  return {
    title: faker.lorem.words(),
    content: faker.lorem.paragraph(),
    createdAt: faker.date.past().toISOString(),
    author,
  };
};

export function serializePost(post: any) {
  return {
    ...post,
    author: post.author.id,
  };
}
