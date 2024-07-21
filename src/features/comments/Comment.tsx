import React from 'react';

import { CommentModel } from './comments-slice';

export type CommentProps = {
  comment: CommentModel;
};

export const Comment: React.FC<CommentProps> = ({ comment }) => {
  return (
    <div>
      <div className='flex flex-row justify-between'>
        <p className='font-semibold'>{comment.owner}</p>
        <p className='text-gray-400'>
          {new Date(comment.createdAt).toLocaleString()}
        </p>
      </div>
      <p>{comment.content}</p>
    </div>
  );
};
