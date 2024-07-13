import { useAppSelector } from '@/src/app/hooks';

import { selectAllPosts, useGetPostsQuery } from './posts-slice';

export const PostList: React.FC = () => {
  const { isLoading } = useGetPostsQuery();
  const posts = useAppSelector(selectAllPosts);

  if (isLoading) return <p>Loading...</p>;

  return (
    <section className='container'>
      <h1>Posts</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{new Date(post.createdAt).toLocaleDateString()}</p>
          <p>{post.author}</p>
        </div>
      ))}
    </section>
  );
};
