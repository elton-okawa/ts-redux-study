import { factory } from '@mswjs/data';

import { commentModel } from './posts/comment';
import { postModel } from './posts/post';
import { voteModel } from './posts/vote';
import { userModel } from './users/user';

export const db = factory({
  user: userModel,
  post: postModel,
  comment: commentModel,
  vote: voteModel,
});

export type MockDatabase = typeof db;
