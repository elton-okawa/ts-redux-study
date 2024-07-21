import { FaceSmileIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export const NavBar: React.FC = () => {
  return (
    <nav className='flex items-center bg-primary-600 text-white font-bold px-4 h-10 shadow-md'>
      <Link to='/' className='flex items-center gap-1 text-center'>
        <FaceSmileIcon className='size-6' />
        <p>Reduxbook</p>
      </Link>
      <div />
    </nav>
  );
};
