import { useAppSelector } from '@/src/app/hooks';

import { selectAllPosts, useGetPostsQuery } from './posts-slice';

export const PostList: React.FC = () => {
  const { isLoading } = useGetPostsQuery();
  const posts = useAppSelector(selectAllPosts);

  if (isLoading) return <p>Loading...</p>;

  return (
    <section className='container'>
      {posts.map((post) => (
        <div key={post.id}>{post.id}</div>
      ))}
    </section>
  );
};
