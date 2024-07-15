import { motion } from 'framer-motion';
import { useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/src/app/hooks';
import { Intersect } from '@/src/components/Intersect';

import { PostItem } from './PostItem';
import { fetchPaginatedPosts, selectPosts } from './posts-slice';

const PAGE_SIZE = 2;

export const PostList: React.FC = () => {
  const dispatch = useAppDispatch();

  const { data } = useAppSelector(selectPosts);

  const loadMore = useCallback(() => {
    dispatch(fetchPaginatedPosts({ cursor: data?.next, pageSize: PAGE_SIZE }));
  }, [data?.next, dispatch]);

  useEffect(() => {
    const promise = dispatch(fetchPaginatedPosts({ pageSize: PAGE_SIZE }));
    return () => promise.abort();
  }, [dispatch]);

  if (!data) return <p>Loading...</p>;

  return (
    <section className='container m-auto flex flex-col gap-4'>
      <motion.ul className='flex flex-col gap-4'>
        {data.results.map((post, i) => {
          const delay = (i % PAGE_SIZE) * 0.5;
          return <PostItem key={post.id} post={post} delay={delay} />;
        })}
      </motion.ul>
      <Intersect onIntersect={loadMore}>Loading...</Intersect>
    </section>
  );
};
