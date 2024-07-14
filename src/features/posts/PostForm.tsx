import { FormEvent } from 'react';
import { useImmer } from 'use-immer';

import { useGetUsersQuery } from '@/src/features/users/users-slice';

import { useNewPostMutation } from './posts-slice';

type FormData = {
  title: string;
  content: string;
  author: string;
};

const initialState: FormData = {
  title: '',
  content: '',
  author: '',
};

export const PostForm: React.FC = () => {
  const { data: users } = useGetUsersQuery();
  const [newPost, result] = useNewPostMutation();
  const [formData, setFormData] = useImmer<FormData>(initialState);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    await newPost({
      title: data.get('title') as string,
      content: data.get('content') as string,
      author: data.get('author') as string,
    });
    setFormData(initialState);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((draft) => {
      draft[field] = value;
    });
  };

  return (
    <section
      title='new-post'
      className='flex flex-col gap-2 p-4 rounded-md bg-gray-100'
    >
      <p className='font-semibold'>Create new post</p>
      <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
        <input
          name='title'
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder='Title'
          disabled={result.isLoading}
          className='px-2 py-1 rounded-md'
        />
        <select
          name='author'
          value={formData.author}
          onChange={(e) => handleChange('author', e.target.value)}
          disabled={result.isLoading}
        >
          {users?.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <textarea
          name='content'
          value={formData.content}
          onChange={(e) => handleChange('content', e.target.value)}
          placeholder='Content'
          disabled={result.isLoading}
          className='px-2 py-1 rounded-md'
        />
        <button
          type='submit'
          disabled={result.isLoading}
          className='self-end rounded-md px-4 py-1 bg-primary-500 hover:bg-primary-400 disabled:bg-gray-300 font-semibold text-white'
        >
          Submit
        </button>
      </form>
    </section>
  );
};
