import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/src/app/hooks';

import { fetchPaginatedPosts, selectPosts } from './posts-slice';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    x: -50,
    transition: { duration: 1, y: { stiffness: 1000 } },
  },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 1, y: { stiffness: 1000 } },
  },
};

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
      <h1>Posts</h1>
      <motion.ul variants={container} initial='hidden' animate='show'>
        {data.results.map((post, i) => {
          const delay = (i % PAGE_SIZE) * 0.5;
          return (
            <motion.li
              key={post.id}
              className={'gap-4 rounded-md shadow-md bg-gray-50'}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay, duration: 1, y: { stiffness: 1000 } }}
            >
              <h2>{post.title}</h2>
              <p>{new Date(post.createdAt).toLocaleDateString()}</p>
              <p>{post.author}</p>
              <Link to={`posts/${post.id}`} className='hover:text-blue-200'>
                Read more
              </Link>
            </motion.li>
          );
        })}
      </motion.ul>
      <button onClick={loadMore} disabled={!hasNext}>
        Load more
      </button>
    </section>
  );
};
