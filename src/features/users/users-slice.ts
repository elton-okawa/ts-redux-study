import { apiSlice } from '@/src/features/api/api-slice';

export type UserSummary = {
  id: string;
  name: string;
};

export type UserDetails = {
  id: string;
  name: string;
};

const extendedSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<UserSummary[], void>({
      query: () => 'users',
    }),
    getUser: build.query<UserSummary, string>({
      query: (id) => `users/${id}`,
    }),
  }),
});

export const { useGetUsersQuery, useGetUserQuery } = extendedSlice;
