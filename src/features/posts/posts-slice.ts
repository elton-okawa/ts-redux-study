import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';

import { RootState } from '@/src/app/store';

import { TagType, apiSlice } from '../api/api-slice';

export type PostSummary = {
  id: string;
  title: string;
  createdAt: string;
  author: string;
};

export type PostDetails = PostSummary & {
  content: string;
};

export type PostResponse = PostSummary[];
export type NewPostData = {
  title: string;
  content: string;
  author: string;
};

const postsAdapter = createEntityAdapter<PostSummary>();
const initialState = postsAdapter.getInitialState();

export const extendedSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<typeof initialState, void>({
      query: () => '/posts',
      providesTags: () => [{ type: TagType.POSTS, id: 'LIST' }],
      transformResponse: (res: PostResponse) =>
        postsAdapter.setAll(initialState, res),
    }),
    getPost: builder.query<PostDetails, string>({
      query: (id) => `/posts/${id}`,
    }),
    newPost: builder.mutation<void, NewPostData>({
      invalidatesTags: [{ type: TagType.POSTS, id: 'LIST' }],
      query: (data) => ({
        method: 'POST',
        url: '/posts',
        body: data,
      }),
    }),
  }),
});
export const { useGetPostsQuery, useGetPostQuery, useNewPostMutation } =
  extendedSlice;

export const selectPostsResult = extendedSlice.endpoints.getPosts.select();
export const selectPostsData = createSelector(
  selectPostsResult,
  (result) => result.data,
);
export const { selectAll: selectAllPosts } = postsAdapter.getSelectors(
  (state: RootState) => selectPostsData(state) ?? initialState,
);
