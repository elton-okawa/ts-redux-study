import { NavBar } from '@/src/components/NavBar';
import { PostForm } from '@/src/features/posts/PostForm';
import { PostList } from '@/src/features/posts/PostList';

export const Component: React.FC = () => {
  return (
    <>
      <NavBar />
      <PostForm />
      <PostList />
    </>
  );
};
