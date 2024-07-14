import { configureStore } from '@reduxjs/toolkit';

import { apiSlice } from '../features/api/api-slice';
import { postsReducer } from '../features/posts/posts-slice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
