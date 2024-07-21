import { useParams } from 'react-router-dom';

import { NavBar } from '@/src/components/NavBar';
import { PostDetails } from '@/src/features/posts/PostDetails';

export const Component: React.FC = () => {
  const { id } = useParams();

  return (
    <>
      <NavBar />
      <div className='flex flex-col max-w-lg m-auto'>
        {id && <PostDetails id={id} />}
        {!id && 'Not Found'}
      </div>
    </>
  );
};
