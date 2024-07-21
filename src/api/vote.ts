import { faker } from '@faker-js/faker';
import { oneOf, primaryKey } from '@mswjs/data';

import { Post } from './post';
import { User } from './user';

export type Vote = {
  id: string;
  owner: User;
  post: Post;
};

export const voteModel = {
  id: primaryKey(faker.string.nanoid),
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
