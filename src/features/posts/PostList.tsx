import { motion } from 'framer-motion';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/src/app/hooks';

import { PostItem } from './PostItem';
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
          return <PostItem post={post} delay={delay} />;
        })}
      </motion.ul>
      <button onClick={loadMore} disabled={!hasNext}>
        Load more
      </button>
    </section>
  );
};
