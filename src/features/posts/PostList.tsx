import { Link } from 'react-router-dom';

import { useAppSelector } from '@/src/app/hooks';

import { selectAllPosts, useGetPostsQuery } from './posts-slice';

export const PostList: React.FC = () => {
  const { isLoading } = useGetPostsQuery();
  const posts = useAppSelector(selectAllPosts);

  if (isLoading) return <p>Loading...</p>;

  return (
    <section className='container m-auto flex flex-col gap-4'>
      <h1>Posts</h1>
      {posts.map((post) => (
        <div key={post.id} className='gap-4 rounded-md shadow-md bg-gray-50'>
          <h2>{post.title}</h2>
          <p>{new Date(post.createdAt).toLocaleDateString()}</p>
          <p>{post.author}</p>
          <Link to={`posts/${post.id}`} className='hover:text-blue-200'>
            Read more
          </Link>
        </div>
      ))}
    </section>
  );
};
