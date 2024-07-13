import { faker } from '@faker-js/faker';
import { oneOf, primaryKey } from '@mswjs/data';
import { nanoid } from '@reduxjs/toolkit';

import { User } from './user';

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

export function serializePostSummary(post: any) {
  return {
    id: post.id,
    title: post.title,
    createdAt: post.createdAt,
    author: post.author.id,
  };
}

export function serializePostDetail(post: any) {
  return {
    ...serializePostSummary(post),
    content: post.content,
  };
}
