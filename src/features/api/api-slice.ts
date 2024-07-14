import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export enum TagType {
  POSTS = 'Posts',
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/fake-api' }),
  tagTypes: [TagType.POSTS],
  endpoints: () => ({}),
});
