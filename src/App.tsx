import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';

import { NavBar } from './components/NavBar';
import { router } from './routes';

export function App() {
  return (
    <main>
      <NavBar />
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </main>
  );
}

export default App;
