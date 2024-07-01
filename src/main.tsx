import React from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';

import App from './App.tsx';
import { worker } from './api/server.js';
import './index.css';

// Wrap app rendering so we can wait for the mock API to initialize
async function start() {
  // Start our mock API server
  await worker.start({ onUnhandledRequest: 'error' });

  // store.dispatch(extendedApiSlice.endpoints.getUsers.initiate())
  const root = createRoot(document.getElementById('root')!);

  root.render(
    <React.StrictMode>
      {/* <Provider store={store}> */}
      <App />
      {/* </Provider> */}
    </React.StrictMode>,
  );
}

start();
