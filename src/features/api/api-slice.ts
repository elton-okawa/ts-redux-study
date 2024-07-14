import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axios from 'axios';

const BASE_URL = '/fake-api';

export enum TagType {
  POSTS = 'Posts',
}

export const client = axios.create({ baseURL: BASE_URL });

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: [TagType.POSTS],
  endpoints: () => ({}),
});
