import { faker } from '@faker-js/faker';
import { factory, manyOf, oneOf, primaryKey } from '@mswjs/data';
import { nanoid } from '@reduxjs/toolkit';

import { Post } from './post';
import { User } from './user';

export type Comment = {
  id: string;
  createdAt: string;
  content: string;
  owner: User;
  post: Post;
};

export const commentModel = {
  id: primaryKey(faker.string.nanoid),
  createdAt: String,
  content: String,
  owner: oneOf('user'),
  post: oneOf('post'),
};

export type CreateCommentParams = {
  owner: User;
  post: Post;
};

export const createCommentData = ({
  owner,
  post,
}: CreateCommentParams): Partial<Comment> => {
  return {
    createdAt: faker.date.past().toISOString(),
    content: faker.lorem.paragraph(),
    owner,
    post,
  };
};

export function serializeComment(comment: any) {
  return {
    ...comment,
    owner: comment.owner.id,
    post: comment.post.id,
  };
}
