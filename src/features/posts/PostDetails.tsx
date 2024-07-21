import { useGetUserQuery } from '@/src/features/users/users-slice';

import { Comments } from '../comments/Comments';
import { User } from '../users/User';
import { useGetPostQuery } from './posts-slice';

export type PostDetailsProps = {
  id: string;
};

export const PostDetails: React.FC<PostDetailsProps> = ({ id }) => {
  const { isLoading, isError, data: post } = useGetPostQuery(id);

  if (isError) return 'An error occurred';
  if (isLoading || !post) return 'Loading...';

  return (
    <div className='mt-8 flex flex-col gap-2'>
      <h1 className='font-bold text-center text-xl mb-2'>{post.title}</h1>
      <div className='flex flex-row justify-between'>
        <User id={post.author} />
        <p className='text-gray-400'>
          {new Date(post.createdAt).toLocaleString()}
        </p>
      </div>
      <p>{post.content}</p>
      <Comments postId={id} />
    </div>
  );
};
