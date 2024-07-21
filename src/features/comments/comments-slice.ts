import { apiSlice } from '../api/api-slice';

export type CommentModel = {
  id: string;
  createdAt: string;
  content: string;
  owner: string;
  post: string;
};

export const extendedSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getComments: build.query<CommentModel[], string>({
      query: (postId) => `posts/${postId}/comments`,
    }),
  }),
});

export const { useGetCommentsQuery } = extendedSlice;
