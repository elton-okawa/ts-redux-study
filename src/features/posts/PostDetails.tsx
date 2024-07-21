import { useGetPostQuery } from './posts-slice';

export type PostDetailsProps = {
  id: string;
};

export const PostDetails: React.FC<PostDetailsProps> = ({ id }) => {
  const { isLoading, isError, data: post } = useGetPostQuery(id);

  if (isError) return 'An error occurred';
  if (isLoading || !post) return 'Loading...';

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
};
