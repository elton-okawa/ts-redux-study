export type PostDetailsProps = {
  id?: string;
};

export const PostDetails: React.FC<PostDetailsProps> = ({ id }) => {
  return <p>{id}</p>;
};
