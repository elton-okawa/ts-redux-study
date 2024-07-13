import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';

import { RootState } from '@/src/app/store';

import { apiSlice } from '../api/api-slice';

export type PostSummary = {
  id: string;
  title: string;
  createdAt: string;
  author: string;
};

export type PostResponse = PostSummary[];

const postsAdapter = createEntityAdapter<PostSummary>();
const initialState = postsAdapter.getInitialState();

export const extendedSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<typeof initialState, void>({
      query: () => '/posts',
      transformResponse: (res: PostResponse) =>
        postsAdapter.setAll(initialState, res),
    }),
  }),
});
export const { useGetPostsQuery } = extendedSlice;

export const selectPostsResult = extendedSlice.endpoints.getPosts.select();
export const selectPostsData = createSelector(
  selectPostsResult,
  (result) => result.data,
);
export const { selectAll: selectAllPosts } = postsAdapter.getSelectors(
  (state: RootState) => selectPostsData(state) ?? initialState,
);
