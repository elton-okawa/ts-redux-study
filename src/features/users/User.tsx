import React from 'react';

import { useGetUserQuery } from './users-slice';

export type UserProps = {
  id: string;
};

export const User: React.FC<UserProps> = ({ id }) => {
  const { isLoading, isError, data: user } = useGetUserQuery(id);

  if (isError) return <p>Unknown User</p>;
  if (isLoading || !user) return <p>Loading...</p>;

  return <p className='font-semibold'>{user.name}</p>;
};
