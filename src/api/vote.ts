import { factory, manyOf, oneOf, primaryKey } from '@mswjs/data';
import { nanoid } from '@reduxjs/toolkit';

import { Post } from './post';
import { User } from './user';

export type Vote = {
  id: string;
  owner: User;
  post: Post;
};

export const voteModel = {
  id: primaryKey(nanoid),
  owner: oneOf('user'),
  post: oneOf('post'),
};

export type CreateVoteParams = {
  owner: User;
  post: Post;
};

export const createVoteData = ({
  owner,
  post,
}: CreateVoteParams): Partial<Vote> => {
  return {
    owner,
    post,
  };
};

export function serializeVote(vote: any) {
  return {
    ...vote,
    owner: vote.owner.id,
    post: vote.post.id,
  };
}
