import { useParams } from 'react-router-dom';

export const Component: React.FC = () => {
  const { id } = useParams();

  return <p>{id}</p>;
};
