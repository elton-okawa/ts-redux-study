import React from 'react';

import { Comment } from './Comment';
import { useGetCommentsQuery } from './comments-slice';

export type CommentsParams = {
  postId: string;
};

export const Comments: React.FC<CommentsParams> = ({ postId }) => {
  const { isError, isLoading, data: comments } = useGetCommentsQuery(postId);

  if (isError) return <p>An error occurred</p>;
  if (isLoading || !comments) return <p>Loading...</p>;

  return (
    <>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </>
  );
};
