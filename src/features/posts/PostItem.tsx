import { motion } from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';

import { PostSummary } from './posts-slice';

export type PostItemProps = {
  post: PostSummary;
  delay: number;
};

export const PostItem: React.FC<PostItemProps> = ({ post, delay }) => {
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
};
