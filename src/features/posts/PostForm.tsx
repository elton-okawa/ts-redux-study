import { FormEvent } from 'react';

import { useGetUsersQuery } from '@/src/features/users/users-slice';

import { useNewPostMutation } from './posts-slice';

export const PostForm: React.FC = () => {
  const { data: users } = useGetUsersQuery();
  const [newPost, result] = useNewPostMutation();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    newPost({
      title: data.get('title') as string,
      content: data.get('content') as string,
      author: data.get('author') as string,
    });
  };

  return (
    <>
      <p>Create new post</p>
      <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
        <input name='title' placeholder='Title' disabled={result.isLoading} />
        <select name='author' disabled={result.isLoading}>
          {users?.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <input
          name='content'
          placeholder='Content'
          disabled={result.isLoading}
        />
        <button type='submit' disabled={result.isLoading}>
          Submit
        </button>
      </form>
    </>
  );
};
