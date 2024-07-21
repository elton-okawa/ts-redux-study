import { useGetUserQuery } from '@/src/features/users/users-slice';

import { useGetPostQuery } from './posts-slice';

export type PostDetailsProps = {
  id: string;
};

export const PostDetails: React.FC<PostDetailsProps> = ({ id }) => {
  const { isLoading, isError, data: post } = useGetPostQuery(id);
  const { data: author } = useGetUserQuery(post?.author ?? '', {
    skip: !post?.author,
  });

  if (isError) return 'An error occurred';
  if (isLoading || !post) return 'Loading...';

  return (
    <div className='mt-8 flex flex-col gap-2'>
      <h1 className='font-bold text-center text-xl mb-2'>{post.title}</h1>
      <div className='flex flex-row justify-between'>
        <p className='font-semibold'>By {author?.name}</p>
        <p className='text-gray-400'>
          {new Date(post.createdAt).toLocaleString()}
        </p>
      </div>
      <p>{post.content}</p>
    </div>
  );
};
