import { Link } from 'react-router-dom';

export const NavBar: React.FC = () => {
  return (
    <nav className='flex items-center bg-gray-50 px-4 h-10 shadow-md'>
      <Link to='/'>Fakebook</Link>
      <div />
    </nav>
  );
};
