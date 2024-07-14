import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import { RootState } from '@/src/app/store';

import { TagType, apiSlice, client } from '../api/api-slice';

export type PostSummary = {
  id: string;
  title: string;
  createdAt: string;
  author: string;
};

export type PostDetails = PostSummary & {
  content: string;
};

export type PostResponse = {
  count: number;
  next: string;
  results: PostSummary[];
};
export type NewPostData = {
  title: string;
  content: string;
  author: string;
};

export const extendedSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<
      PostResponse,
      { cursor?: string; pageSize?: number }
    >({
      query: ({ cursor, pageSize = 2 }) => ({
        url: '/posts',
        params: { cursor, pageSize },
      }),
      providesTags: () => [{ type: TagType.POSTS, id: 'LIST' }],
      merge: (current, res) => {
        current.count = res.count;
        current.next = res.next;
        current.results.push(...res.results);
      },
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.cursor !== previousArg?.cursor ||
          currentArg?.pageSize !== previousArg?.pageSize
        );
      },
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
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(clearPosts());
          dispatch(fetchPaginatedPosts());
        } catch (error) {
          // TODO handle error
          console.error(error);
        }
      },
    }),
  }),
});
export const { useGetPostsQuery, useGetPostQuery, useNewPostMutation } =
  extendedSlice;

export type PaginationParams = {
  cursor?: string;
  pageSize?: number;
};
// RTK Query does not have infinite scroll implemented
// https://github.com/reduxjs/redux-toolkit/discussions/3174
export const fetchPaginatedPosts = createAsyncThunk(
  'posts/fetchPaginatedPosts',
  async ({ cursor, pageSize = 2 }: PaginationParams | void = {}) => {
    const { data } = await client.get<PostResponse>('/posts', {
      params: { cursor, pageSize },
    });

    return data;
  },
);

export type PostsSliceState = {
  status: 'idle' | 'loading' | 'error';
  data: {
    count: number;
    next: string;
    results: PostSummary[];
  } | null;
};

const initialState: PostsSliceState = {
  data: null,
  status: 'idle',
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearPosts: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPaginatedPosts.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchPaginatedPosts.rejected, (state) => {
      state.status = 'error';
    });
    builder.addCase(fetchPaginatedPosts.fulfilled, (state, action) => {
      state.status = 'idle';
      state.data = {
        count: action.payload.count,
        next: action.payload.next,
        results: (state.data?.results ?? []).concat(action.payload.results),
      };
    });
  },
});

export const selectPosts = createSelector(
  [(state: RootState) => state.posts],
  (posts) => ({
    data: posts.data,
    isLoading: posts.status === 'loading',
    isError: posts.status === 'error',
  }),
);

export const postsReducer = postsSlice.reducer;
export const { clearPosts } = postsSlice.actions;
