import { NavBar } from '@/src/components/NavBar';
import { PostForm } from '@/src/features/posts/PostForm';
import { PostList } from '@/src/features/posts/PostList';

export const Component: React.FC = () => {
  return (
    <>
      <NavBar />
      <div className='flex flex-col gap-4 max-w-lg px-10 mx-auto'>
        <PostForm />
        <PostList />
      </div>
    </>
  );
};
