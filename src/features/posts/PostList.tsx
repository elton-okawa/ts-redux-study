import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/src/app/hooks';

import { fetchPaginatedPosts, selectPosts } from './posts-slice';

const PAGE_SIZE = 2;

export const PostList: React.FC = () => {
  const dispatch = useAppDispatch();

  const { data } = useAppSelector(selectPosts);

  useEffect(() => {
    const promise = dispatch(fetchPaginatedPosts({ pageSize: PAGE_SIZE }));
    return () => promise.abort();
  }, [dispatch]);

  const loadMore = () => {
    dispatch(fetchPaginatedPosts({ cursor: data?.next, pageSize: PAGE_SIZE }));
  };

  if (!data) return <p>Loading...</p>;
  const hasNext = data.count > data.results.length;

  return (
    <section className='container m-auto flex flex-col gap-4'>
      <motion.ul className='flex flex-col gap-4'>
        {data.results.map((post, i) => {
          const delay = (i % PAGE_SIZE) * 0.5;
          return (
            <Link
              key={post.id}
              to={`posts/${post.id}`}
              className='text-primary-500 hover:text-primary-300'
            >
              <motion.li
                className={'p-4 rounded-md shadow-md bg-gray-100'}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay, duration: 1, y: { stiffness: 1000 } }}
              >
                <h2 className='font-semibold text-black'>{post.title}</h2>
                <p className='text-gray-400 text-sm'>
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p className='my-2 text-black'>{post.summary}</p>

                <p>Read more</p>
              </motion.li>
            </Link>
          );
        })}
      </motion.ul>
      <button onClick={loadMore} disabled={!hasNext}>
        Load more
      </button>
    </section>
  );
};
