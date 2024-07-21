import { apiSlice } from '@/src/features/api/api-slice';

export type UserSummary = {
  id: string;
  name: string;
};

const extendedSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<UserSummary[], void>({
      query: () => 'users',
    }),
  }),
});

export const { useGetUsersQuery } = extendedSlice;
