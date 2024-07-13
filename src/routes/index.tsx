import { NavBar } from '@/src/components/NavBar';
import { PostList } from '@/src/features/posts/PostList';

export const Component: React.FC = () => {
  return (
    <>
      <NavBar />
      <PostList />
    </>
  );
};
